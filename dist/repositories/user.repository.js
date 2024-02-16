"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepositoryPrisma = void 0;
const prisma_client_1 = require("../database/prisma-client");
class UserRepositoryPrisma {
    async create(data) {
        const result = await prisma_client_1.prisma.user.create({
            data: {
                id: data.id,
                name: data.name,
                email: data.email
            }
        });
        return result;
    }
    async delete(id) {
        const result = await prisma_client_1.prisma.user.delete({
            where: {
                id
            }
        });
        return result;
    }
    async findByEmail(email) {
        if (email) {
            const result = await prisma_client_1.prisma.user.findFirst({
                where: {
                    email
                }
            });
            return result || null;
        }
        //TOFIX:
        throw new Error(`Cannot find user with email: ${email}`);
    }
    //TOFIX:
    //VALIDADOR SE EXISTE O ID RECEBIDO.
    async findById(id) {
        const result = await prisma_client_1.prisma.user.findFirst({
            where: {
                id
            }
        });
        return result || null;
    }
    async setUserPaid(id) {
        const result = await prisma_client_1.prisma.user.update({
            where: {
                id
            },
            data: {
                isPaid: true
            }
        });
        return result || null;
    }
    async checkIfUserPaid(id) {
        const user = await prisma_client_1.prisma.user.findFirst({
            where: {
                id: id,
                isPaid: true
            }
        });
        if (user) {
            return true;
        }
        return false;
    }
}
exports.UserRepositoryPrisma = UserRepositoryPrisma;
