import { Context } from "hono";

// Controller to get all entities
export const getEntitiesController = <T>(service: (c: Context) => Promise<T[]>) => async (c: Context) => {
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
export const getEntityByIdController = <T>(service: (id: number, c: Context) => Promise<T | undefined>) => async (c: Context) => {
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
export const createEntityController = <T>(service: (entity: T, c: Context) => Promise<string>) => async (c: Context) => {
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
export const updateEntityController = <T>(service: (id: number, entity: T, c: Context) => Promise<string>) => async (c: Context) => {
    try {
        const id = parseInt(c.req.param("id"));
        if (isNaN(id)) return c.text("Invalid id", 400);

        // Update entity
        const entity = await c.req.json();
        const res = await service(id, entity, c);
        if (!res) return c.text("Not updated", 400);
        return c.json({ message: res }, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
}