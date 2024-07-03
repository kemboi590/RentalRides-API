import { eq } from "drizzle-orm";
import db from "../drizzle/db";

import { TISupportTickets, TSSupportTickets, supportTicketsTable } from "../drizzle/schema";

// GET ALL SUPPORT TICKETS
export const getSupportTicketsService = async (): Promise<TSSupportTickets[]> => {
    const supportTickets = await db.query.supportTicketsTable.findMany();
    return supportTickets;
}

// GET SUPPORT TICKET BY ID
export const getSupportTicketByIdService = async (id: number): Promise<TSSupportTickets | undefined> => {
    const supportTicket = await db.query.supportTicketsTable.findFirst({
        where: eq(supportTicketsTable.ticket_id, id)
    });
    return supportTicket || undefined;
}

// CHECK IF SUPPORT TICKET EXISTS
export const supportTicketExistsService = async (id: number): Promise<boolean> => {
    const supportTicket = await getSupportTicketByIdService(id);
    return supportTicket !== undefined; //returns true if support ticket exists
}

// CREATE SUPPORT TICKET
export const createSupportTicketService = async (supportTicket: TISupportTickets): Promise<string> => {
    await db.insert(supportTicketsTable).values(supportTicket)
    return "support ticket created successfully";
}

//  UPDATE SUPPORT TICKET
export const updateSupportTicketService = async (id: number, supportTicket: TISupportTickets): Promise<string> => {
    await db.update(supportTicketsTable).set(supportTicket).where(eq(supportTicketsTable.ticket_id, id));
    return "support ticket updated successfully";
}

// DELETE SUPPORT TICKET    
export const deleteSupportTicketService = async (id: number): Promise<string> => {
    await db.delete(supportTicketsTable).where(eq(supportTicketsTable.ticket_id, id));
    return "support ticket deleted successfully";
}
