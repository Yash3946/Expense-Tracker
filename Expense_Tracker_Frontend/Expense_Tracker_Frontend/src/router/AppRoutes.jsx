import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Login } from "../common/Login"
import { ExpenseDashboard } from "../user/ExpenseDashboard"
import { AddCategory } from "../user/AddCategory"
import { GetMyCategories } from "../user/GetMyCategories"
import { UserNavbar } from "../user/UserNavbar"

const AppRoutes = () => {


    const router = createBrowserRouter([
        {
            path: "/login",
            element: <Login />
        },
        // {
        //     path:"/signup",
        //     element:<Signup/>
        // }
   {
            path:"",
            element:<UserNavbar/>,
            children:[
                {
                    path:"",
                    element:<ExpenseDashboard/>
                },
                {
                    path:"add-category",
                    element:<AddCategory/>
                },{
                    path:"my-categories",
                    element:<GetMyCategories/>
                }
            ]
        }
        // {
        //     path:"/signup",
        //     element:<Signup/>
        // }
    ])

    return <RouterProvider router={router} />

}
export default AppRoutes;