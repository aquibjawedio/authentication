import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { useNavigate } from "react-router-dom";
import { handleLogout } from "../api/userAPI";
import { toast } from "sonner";

const LogoutDialog = () => {
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await handleLogout();
      navigate("/login");
    } catch (error) {
      toast(error.message);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" className="flex-1 cursor-pointer">
          Logout
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-zinc-900 text-zinc-100 border-0 shadow-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to logout? This action cannot be undone. You
            will need to login again to access your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className=" cursor-pointer text-gray-950 hover:text-gray-950">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="cursor-pointer bg-red-500 hover:bg-red-600"
            onClick={logoutHandler}
          >
            Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutDialog;
