import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import Tickets from "@/models/tickets";
import User from "@/models/users";
import { getAuthUser } from "@/lib/auth";

// GET - Fetch tickets

interface UpdateData {
  adminAnswer?: string;
  adminAttachments?: string[];
  status?: string;
}
export async function GET(request: NextRequest) {
  try {
    await connect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");
    const category = searchParams.get("category");

    // Check authentication
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const query: Record<string, string> = {};

    // If user is not admin, only show their own tickets
    const isAdmin =
      authUser.roles &&
      (authUser.roles.includes("admin") ||
        authUser.roles.includes("super_admin"));

    if (!isAdmin) {
      // Find user in database to get their MongoDB _id
      const currentUser = await User.findOne({
        $or: [{ username: authUser.id }, { _id: authUser.id }],
      });
      if (!currentUser) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }
      query.user = currentUser._id;
    }

    // If userId is provided and user is admin, filter by user
    if (userId && isAdmin) {
      query.user = userId;
    }

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Filter by category if provided
    if (category) {
      query.category = category;
    }

    // Fetch tickets
    const tickets = await Tickets.find(query)
      .populate("user", "nationalCredentials personalInformations")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}

// POST - Create a new ticket
export async function POST(request: NextRequest) {
  try {
    await connect();

    const body = await request.json();
    const { category, description, attachments } = body;

    // Validation
    if (!category || !description) {
      return NextResponse.json(
        { success: false, message: "Category and description are required" },
        { status: 400 }
      );
    }

    // Check authentication
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    // Find user in database to get their MongoDB _id
    const currentUser = await User.findOne({
      $or: [{ username: authUser.id }, { _id: authUser.id }],
    });
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Create ticket
    const ticket = new Tickets({
      user: currentUser._id,
      category,
      description,
      attachments: attachments || [],
      status: "open",
    });

    await ticket.save();

    // Populate user data for response
    const populatedTicket = await Tickets.findById(ticket._id).populate(
      "user",
      "nationalCredentials personalInformations"
    );

    return NextResponse.json({
      success: true,
      data: populatedTicket,
      message: "Ticket created successfully",
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}

// PUT - Update a ticket
export async function PUT(request: NextRequest) {
  try {
    await connect();

    const body = await request.json();
    const { ticketId, adminAnswer, adminAttachments, status } = body;

    if (!ticketId) {
      return NextResponse.json(
        { success: false, message: "Ticket ID is required" },
        { status: 400 }
      );
    }

    // Check authentication
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    // Find the ticket
    const ticket = await Tickets.findById(ticketId);
    if (!ticket) {
      return NextResponse.json(
        { success: false, message: "Ticket not found" },
        { status: 404 }
      );
    }

    // Check permissions
    const isAdmin =
      authUser.roles &&
      (authUser.roles.includes("admin") ||
        authUser.roles.includes("super_admin"));

    // For non-admin users, find user in database to verify ownership
    if (!isAdmin) {
      const currentUser = await User.findOne({
        $or: [{ username: authUser.id }, { _id: authUser.id }],
      });
      if (
        !currentUser ||
        ticket.user.toString() !== currentUser._id.toString()
      ) {
        return NextResponse.json(
          { success: false, message: "Not authorized to update this ticket" },
          { status: 403 }
        );
      }
    }

    // Update ticket
    const updateData: UpdateData = {};

    if (adminAnswer && isAdmin) {
      updateData.adminAnswer = adminAnswer;
      updateData.adminAttachments = adminAttachments || [];
      updateData.status = "in_progress";
    }

    if (status && isAdmin) {
      updateData.status = status;
    }

    const updatedTicket = await Tickets.findByIdAndUpdate(
      ticketId,
      updateData,
      { new: true }
    ).populate("user", "nationalCredentials personalInformations");

    return NextResponse.json({
      success: true,
      data: updatedTicket,
      message: "Ticket updated successfully",
    });
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete ticket (admin only)
export async function DELETE(request: NextRequest) {
  try {
    await connect();

    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get("ticketId");

    if (!ticketId) {
      return NextResponse.json(
        { success: false, message: "Ticket ID is required" },
        { status: 400 }
      );
    }

    // Check authentication
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const isAdmin =
      authUser.roles &&
      (authUser.roles.includes("admin") ||
        authUser.roles.includes("super_admin"));

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }

    // Delete ticket
    const deletedTicket = await Tickets.findByIdAndDelete(ticketId);
    if (!deletedTicket) {
      return NextResponse.json(
        { success: false, message: "Ticket not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}
