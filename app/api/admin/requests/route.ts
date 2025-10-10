import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import Request from "@/models/request";
import { getAuthUser } from "@/lib/auth";

// Admin endpoint for updating request status and handling rejections
export async function PUT(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser || !authUser.roles.includes('admin')) {
      return NextResponse.json(
        { error: "غیر مجاز - دسترسی مدیریت لازم است" },
        { status: 403 }
      );
    }

    await connect();
    const body = await request.json();
    const { 
      requestId, 
      status, 
      rejectedReason, 
      assignedTo, 
      priority,
      adminNote,
      isNoteVisibleToCustomer = false,
      estimatedCompletionDate
    } = body;

    if (!requestId) {
      return NextResponse.json(
        { error: "شناسه درخواست الزامی است" },
        { status: 400 }
      );
    }

    const serviceRequest = await Request.findById(requestId);
    if (!serviceRequest) {
      return NextResponse.json(
        { error: "درخواست یافت نشد" },
        { status: 404 }
      );
    }

    // Update status
    if (status) {
      serviceRequest.status = status;

      if (status === 'rejected') {
        serviceRequest.rejectedBy = authUser.id;
        serviceRequest.rejectedAt = new Date();
        serviceRequest.rejectedReason = rejectedReason;
      } else if (status === 'completed') {
        serviceRequest.actualCompletionDate = new Date();
        if (!serviceRequest.approvedBy) {
          serviceRequest.approvedBy = authUser.id;
          serviceRequest.approvedAt = new Date();
        }
      } else if (status === 'in_progress') {
        if (!serviceRequest.assignedTo && assignedTo) {
          serviceRequest.assignedTo = assignedTo;
        }
      }
    }

    // Update other fields
    if (assignedTo) serviceRequest.assignedTo = assignedTo;
    if (priority) serviceRequest.priority = priority;
    if (estimatedCompletionDate) serviceRequest.estimatedCompletionDate = new Date(estimatedCompletionDate);

    // Add admin note
    if (adminNote) {
      serviceRequest.adminNotes.push({
        note: adminNote,
        addedBy: authUser.id,
        addedAt: new Date(),
        isVisibleToCustomer: isNoteVisibleToCustomer
      });
    }

    await serviceRequest.save();

    // Populate for response
    await serviceRequest.populate([
      { path: 'service', select: 'title icon slug fee' },
      { path: 'customer', select: 'nationalCredentials.firstName nationalCredentials.lastName contactInfo.email contactInfo.mobilePhone' },
      { path: 'assignedTo', select: 'nationalCredentials.firstName nationalCredentials.lastName' },
      { path: 'adminNotes.addedBy', select: 'nationalCredentials.firstName nationalCredentials.lastName' }
    ]);

    return NextResponse.json({
      success: true,
      message: "درخواست با موفقیت به‌روزرسانی شد",
      data: serviceRequest
    });

  } catch (error) {
    console.error('Admin update error:', error);
    return NextResponse.json(
      { error: "خطای سرور" },
      { status: 500 }
    );
  }
}