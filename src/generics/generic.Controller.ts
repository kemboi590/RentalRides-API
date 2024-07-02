import { Context } from "hono";

// Controller to get all entities
export const getEntitiesController = <T>(service: (c: Context) => Promise<T[]>) => async (c: Context) => {
    try {
        const entities = await service(c);
        if (entities == null || entities.length == 0) {
            return c.text("No entities found", 404);
        }
        return c.json(entities, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 500);
    }
}



