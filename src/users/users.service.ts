import { eq, sql } from "drizzle-orm";
import db from "../drizzle/db";
import { TIUsers, TSUsers, usersTable } from "../drizzle/schema";

// GET ALL USERS
export const getUsersService = async (): Promise<TSUsers[]> => {
    const users = await db.query.usersTable.findMany();
    return users;
};

// GET USER BY ID
export const getUserByIdService = async (id: number): Promise<TSUsers | undefined> => {
    const user = await db.query.usersTable.findFirst({
        where: eq(usersTable.user_id, id)
    });
    return user || undefined;
}

// CHECK IF USER EXISTS
export const userExistsService = async (id: number): Promise<boolean> => {
    const user = await getUserByIdService(id);
    return user !== undefined; //returns true if user exists
}

// type TRIUser = Array<{id: number,full_name: string,email: string,contact_phone: string,address: string,}>

// CREATE USER
export const createUserService = async (user: TIUsers): Promise<string> => {
    await db.insert(usersTable).values(user)
    return "user created successfully";
                        //OR
    // return await db.insert(usersTable).values(user).returning({
    //     id:usersTable.user_id,
    //     full_name:usersTable.full_name, 
    //     email:usersTable.email, 
    //     contact_phone:usersTable.contact_phone,
    //     address:usersTable.address
    //     }).execute();

}

//  UPDATE USER
export const updateUserService = async (id: number, user: TIUsers): Promise<string> => {
    await db.update(usersTable).set(user).where(eq(usersTable.user_id, id));
    return "user updated successfully";
}

// DELETE USER
export const deleteUserService = async (id: number): Promise<string> => {
    await db.delete(usersTable).where(eq(usersTable.user_id, id));
    return "user deleted successfully";
}

export const userLoginService = async (user:TSUsers) => {
    const {email} = user;
    return await db.query.usersTable.findFirst({
        columns: {
            user_id:true,
            full_name:true,
            email:true,
            contact_phone:true,
            address:true,
            password:true,
            role:true
        }, where: sql`${usersTable.email} = ${email}`,
    })
}
