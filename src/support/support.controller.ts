import {
    getEntitiesController, getEntityByIdController, createEntityController,
    updateEntityController, deleteEntityController
} from "../baseController/base.Generic.Controller";

import {
    getSupportTicketsService, getSupportTicketByIdService, supportTicketExistsService, createSupportTicketService,
    updateSupportTicketService, deleteSupportTicketService
} from "./support.service";

// get all support tickets
export const getSupportTicketsController = getEntitiesController(getSupportTicketsService);
// get support ticket by id
export const getSupportTicketByIdController = getEntityByIdController(getSupportTicketByIdService);
// create support ticket
export const createSupportTicketController = createEntityController(createSupportTicketService);
//  update support ticket
export const updateSupportTicketController = updateEntityController(supportTicketExistsService, updateSupportTicketService);
// delete support ticket
export const deleteSupportTicketController = deleteEntityController(supportTicketExistsService, deleteSupportTicketService);