import { promises } from "dns";
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
export const updateEntityController = <T>(existService:(id:number, c:Context)=>Promise<boolean>, service: (id: number, entity: T, c: Context) => Promise<string>) => async (c: Context) => {
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
export const deleteEntityController = <T>(existService:(id:number, c:Context)=>Promise<boolean>, service: (id: number, c: Context) => Promise<string>) => async (c: Context) => {
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