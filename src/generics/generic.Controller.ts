import { promises } from "dns";
import { Context } from "hono";

// interface for service to get all entities
export interface GetEntitiesService<T> {
    (c: Context): Promise<T[]>;
}

// interface for service to get entity by id
export interface GetEntityByIdService<T> {
    (id: number, c: Context): Promise<T | undefined>;
}

// interface for service to create entity
export interface CreateEntityService<T> {
    (entity: T, c: Context): Promise<string>;
}

// interface for service to update entity
export interface UpdateEntityService<T> {
    (id: number, entity: T, c: Context): Promise<string>;
}

// interface for service to delete entity
export interface DeleteEntityService {
    (id: number, c: Context): Promise<string>;
}

// iterface for exist service
export interface ExistService {
    (id: number, c: Context): Promise<boolean>;
}


// Controller to get all entities
export const getEntitiesController = <T>(service: GetEntitiesService<T>) => async (c: Context) => {
    try {
        const entities = await service(c);
        if (entities == null || entities.length == 0) {
            return c.text("Not found", 404);
        }
        return c.json(entities, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
}

// controller to get entity by id
export const getEntityByIdController = <T>(service: GetEntityByIdService<T>) => async (c: Context) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) return c.text("Invalid id", 400);

        const entity = await service(id, c);
        if (entity == null) {
            return c.text("Not found", 404);
        }
        return c.json(entity, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
}

// controller to create entity
export const createEntityController = <T>(service: CreateEntityService<T>) => async (c: Context) => {
    try {
        const entity = await c.req.json();
        const res = await service(entity, c);
        if (!res) return c.text("Not created", 400);
        return c.json({ message: res }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
}


// controller to update entity
export const updateEntityController = <T>(existService: ExistService, service: UpdateEntityService<T>) => async (c: Context) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) return c.text("Invalid id", 400);

        // first check before update
        const exists = await existService(id, c);
        if (!exists) return c.text("Not found", 404);

        // Update entity
        const entity = await c.req.json();
        const res = await service(id, entity, c);
        if (!res) return c.text("Not updated", 400);
        return c.json({ message: res }, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
}

// controller to delete entity
export const deleteEntityController = <T>(existService: ExistService, service: DeleteEntityService) => async (c: Context) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) return c.text("Invalid id", 400);

        // first check before delete
        const exists = await existService(id, c);
        if (!exists) return c.text("Not found", 404);

        // Delete entity
        const res = await service(id, c);
        if (!res) return c.text("Not deleted", 400);
        return c.json({ message: res }, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
}