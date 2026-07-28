import { Request, Response } from "express";
import { createUser, findUserByEmail } from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const register = async (
    req: Request,
    res: Response
) => {

    try {

        const { name, email, password } = req.body;


        // Hash password
        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        // Save user
        const user = await createUser(
            name,
            email,
            hashedPassword
        );


        res.status(201).json({

            message: "User registered successfully",

            user

        });


    } catch(error) {

        console.log(
            "REGISTER ERROR:",
            error
        );


        res.status(500).json({

            message:"Internal Server Error"

        });

    }

};



// LOGIN

export const login = async (
    req: Request,
    res: Response
) => {


    try {


        const {
            email,
            password
        } = req.body;



        // Find user by email
        const user = await findUserByEmail(email);



        if(!user) {

            return res.status(404).json({

                message:"User not found"

            });

        }



        // DEBUG CHECK
        console.log(
            "USER FROM DB:",
            user
        );


        console.log(
            "ENTERED PASSWORD:",
            password
        );



        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );



        if(!isMatch) {


            return res.status(401).json({

                message:"Invalid Email or Password"

            });

        }



        // Generate JWT Token
        const token = jwt.sign(

            {
                id:user.id,
                email:user.email,
                role:user.role
            },


            process.env.JWT_SECRET as string,


            {
                expiresIn:"1d"
            }

        );




        // Response

        res.status(200).json({

            message:"Login successful",


            token,


            user:{

                id:user.id,

                name:user.name,

                email:user.email,

                role:user.role

            }

        });



    } catch(error) {


        console.log(
            "LOGIN ERROR:",
            error
        );


        res.status(500).json({

            message:"Internal Server Error"

        });

    }

};




// PROFILE

export const profile = async (
    req: Request,
    res: Response
) => {


    res.status(200).json({

        message:"Welcome! This is a protected profile.",

        user:"Authenticated User"

    });


};