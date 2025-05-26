import Elysia, { t } from "elysia"
import { UserService } from "../../services/user/user.service"
import { UserRepo } from "../../repositories/user.repo"
import { createSchemaUser, updateSchemaUser } from "../../schemas/user/user.schema"
import { ResponseHandler } from "../../utils/response.utils"
import { requireAuth, requireRole } from "../../middlewares/auth.middleware"

// สร้าง instance ของ service และ repo
const userRepo = new UserRepo()
const userService = new UserService(userRepo)

export const UserController = new Elysia({ prefix: '/users' })
  // ดึงข้อมูล user ทั้งหมด - ต้องมีการยืนยันตัวตนและมี role เป็น admin
  .use(requireRole('admin'))  
  .get('/findAll', 
    async () => {
      const users = await userService.findAll()
      return ResponseHandler.success(users, "Users retrieved successfully")
    },
    {
      // เพิ่มคำอธิบายสำหรับ Swagger
      detail: {
        summary: 'Get all users',
        description: 'Retrieve a list of all active users in the system',
        tags: ['Users']
      }
    }
  )
  
  // ดึงข้อมูล user ตาม id - ต้องมีการยืนยันตัวตน
  .use(requireAuth)
  .get('/:id', 
    async ({ params }) => {
      const user = await userService.findById(params.id)
      if (!user) {
        return ResponseHandler.notFound(`User with id ${params.id} not found`)
      }
      return ResponseHandler.success(user, "User retrieved successfully")
    },
    {
      // เพิ่มคำอธิบายสำหรับ Swagger
      detail: {
        summary: 'Get user by ID',
        description: 'Retrieve a specific user by their unique identifier',
        tags: ['Users']
      },
      params: t.Object({
        id: t.String({ description: 'The unique identifier of the user' })
      })
    }
  )
  
  // สร้าง user ใหม่
  .post('/register', 
    async ({ body }) => {
      try {
        const newUser = await userService.createUser(body)
        return ResponseHandler.success(newUser, "User created successfully", 201)
      } catch (error: any) {
        // ตรวจสอบ error message เพื่อให้การตอบกลับที่เหมาะสม
        if (error.message?.includes("duplicate")) {
          return ResponseHandler.validationError("Username or email already exists")
        }
        return ResponseHandler.serverError(error.message || "Failed to create user")
      }
    },
    {
      body: createSchemaUser, // ใช้ schema จาก repo สำหรับ validate request body
      // เพิ่มคำอธิบายสำหรับ Swagger
      detail: {
        summary: 'Register new user',
        description: 'Create a new user account in the system',
        tags: ['Users', 'Authentication']
      }
    }
  )
  
  // อัพเดทข้อมูล user - ต้องมีการยืนยันตัวตน
  .use(requireAuth)
  .put('/:id', 
    async ({ params, body }) => {
      // ตรวจสอบว่า user มีอยู่หรือไม่
      const existingUser = await userService.findById(params.id)
      if (!existingUser) {
        return ResponseHandler.notFound(`User with id ${params.id} not found`)
      }
      
      try {
        const updatedUser = await userService.updateUser(params.id, body)
        return ResponseHandler.success(updatedUser, "User updated successfully")
      } catch (error: any) {
        if (error.message?.includes("duplicate")) {
          return ResponseHandler.validationError("Email already in use")
        }
        return ResponseHandler.serverError(error.message || "Failed to update user")
      }
    },
    {
      body: updateSchemaUser,
      params: t.Object({
        id: t.String({ description: 'The unique identifier of the user to update' })
      }),
      // เพิ่มคำอธิบายสำหรับ Swagger
      detail: {
        summary: 'Update user',
        description: 'Update an existing user\'s information',
        tags: ['Users']
      }
    }
  )
  
  // ลบข้อมูล user (soft delete) - ต้องมีการยืนยันตัวตนและมี role เป็น admin
  .use(requireRole('admin'))
  .delete('/:id', 
    async ({ params }) => {
      // ตรวจสอบว่า user มีอยู่หรือไม่
      const existingUser = await userService.findById(params.id)
      if (!existingUser) {
        return ResponseHandler.notFound(`User with id ${params.id} not found`)
      }
      
      try {
        const success = await userService.deleteUser(params.id)
        if (success) {
          return ResponseHandler.success(null, "User deleted successfully")
        } else {
          return ResponseHandler.serverError("Failed to delete user")
        }
      } catch (error: any) {
        return ResponseHandler.serverError(error.message || "Failed to delete user")
      }
    },
    {
      params: t.Object({
        id: t.String({ description: 'The unique identifier of the user to delete' })
      }),
      // เพิ่มคำอธิบายสำหรับ Swagger
      detail: {
        summary: 'Delete user',
        description: 'Soft delete a user from the system (marks as deleted but does not remove from database)',
        tags: ['Users']
      }
    }
  )
