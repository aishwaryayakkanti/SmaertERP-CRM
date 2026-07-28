import express from "express";
import {
addEmployee,
editEmployee,
removeEmployee,
getEmployees,
getEmployee
} from "../controllers/employeeController";

import { authenticate } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";


const router = express.Router();

router.get(
"/",
authenticate,
getEmployees
);

router.get(
"/:id",
authenticate,
getEmployee
);

router.post(
"/",
authenticate,
authorize("admin"),
addEmployee
);


router.put(
"/:id",
authenticate,
authorize("admin"),
editEmployee
);


router.delete(
"/:id",
authenticate,
authorize("admin"),
removeEmployee
);


export default router;