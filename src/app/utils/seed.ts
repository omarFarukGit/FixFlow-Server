import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { Role, TechnicianStatus } from "../../generated/prisma/enums";
import config from "../config";
import { prisma } from "../lib/prisma";
import { AppError } from "./AppError";

// Create tester customer

export const seedTesterCustomer = async () => {
  try {
    const isTesterCustomerExist = await prisma.user.findUnique({
      where: {
        email: config.tester_customer_email,
      },
    });

    if (isTesterCustomerExist) {
      console.log("Tester Customer Already Exists!");
      return;
    }

    const name = config.tester_customer_name;
    const email = config.tester_customer_email;
    const password = config.tester_customer_password;

    if (!name || !email || !password) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Tester Customer Name, Email, Password Missing In Env File!!!",
      );
    }

    const hashedPassword = await bcrypt.hash(
      password,
      Number(config.bcrypt_salt_rounds),
    );

    const testerCustomer = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.CUSTOMER,
        needPasswordChange: false,
        emailVerified: true,
      },
    });

    console.log("Tester Customer Created : ", testerCustomer);
  } catch (error) {
    console.log("Error Seeding Tester Customer : ", error);

    if (config.tester_customer_email) {
      await prisma.user.delete({
        where: {
          email: config.tester_customer_email,
        },
      });
    }
  }
};

// Create tester admin

export const seedTesterAdmin = async () => {
  try {
    const isTesterAdminExist = await prisma.user.findUnique({
      where: {
        email: config.tester_admin_email,
      },
    });

    if (isTesterAdminExist) {
      console.log("Tester Admin Already Exists!");
      return;
    }

    const name = config.tester_admin_name;
    const email = config.tester_admin_email;
    const password = config.tester_admin_password;

    if (!name || !email || !password) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Tester Admin Name, Email, Password Missing In Env File!!!",
      );
    }

    const hashedPassword = await bcrypt.hash(
      password,
      Number(config.bcrypt_salt_rounds),
    );

    const testerAdmin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.ADMIN,
        needPasswordChange: false,
        emailVerified: true,
      },
    });

    console.log("Tester Admin Created : ", testerAdmin);
  } catch (error) {
    console.log("Error Seeding Tester Admin : ", error);

    if (config.tester_admin_email) {
      await prisma.user.delete({
        where: {
          email: config.tester_admin_email,
        },
      });
    }
  }
};

// Create tester technician

export const seedTesterTechnician = async () => {
  try {
    const isTesterTechnicianExist = await prisma.user.findUnique({
      where: {
        email: config.tester_technician_email,
      },
    });

    if (isTesterTechnicianExist) {
      console.log("Tester Technician Already Exists!");
      return;
    }

    const name = config.tester_technician_name;
    const email = config.tester_technician_email;
    const password = config.tester_technician_password;

    if (!name || !email || !password) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Tester Technician Name, Email, Password Missing In Env File!!!",
      );
    }

    const hashedPassword = await bcrypt.hash(
      password,
      Number(config.bcrypt_salt_rounds),
    );

    const testerTechnician = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.TECHNICIAN,
        needPasswordChange: false,
        emailVerified: true,

        technicianProfile: {
          create: {
            bio: "Professional AC and electrical technician",
            experienceYears: 5,
            skills: ["AC Repair", "Electrical Wiring", "AC Installation"],
            hourlyRate: 500,
            status: TechnicianStatus.AVAILABLE,
            averageRating: 0,
            totalJobs: 0,
            isApproved: true,
          },
        },
      },
    });

    console.log("Tester Technician Created : ", testerTechnician);
  } catch (error) {
    console.log("Error Seeding Tester Technician : ", error);

    if (config.tester_technician_email) {
      await prisma.user.delete({
        where: {
          email: config.tester_technician_email,
        },
      });
    }
  }
};
