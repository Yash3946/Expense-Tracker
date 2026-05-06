import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Login } from "../common/Login"
import { ExpenseDashboard } from "../user/ExpenseDashboard"
import { AddCategory } from "../user/AddCategory"
import { GetMyCategories } from "../user/GetMyCategories"
import { UserNavbar } from "../user/UserNavbar"
import { AddExpense } from "../user/AddExpense"
import { MyExpenses } from "../user/MyExpenses"

const AppRoutes = () => {

    const router = createBrowserRouter([
        {
            path: "/login",
            element: <Login />
        },
        {
            path: "/",   // ✅ yaha "/" use karo
            element: <UserNavbar />,
            children: [
                {
                    path: "",   // default child route
                    element: <ExpenseDashboard />
                },
                {
                    path: "add-category",
                    element: <AddCategory />
                },
                {
                    path: "my-categories",
                    element: <GetMyCategories />
                },
                {
                    path:"add-expense",
                    element:<AddExpense />
                },
                {
                    path:"my-expenses",
                    element:<MyExpenses />
                }
            ]
        }
    ])

    return <RouterProvider router={router} />
}

export default AppRoutes;