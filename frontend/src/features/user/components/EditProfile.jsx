import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateUserSchema } from "../schemas/userSchema";

const EditProfileDialog = ({ user }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      fullname: user?.fullname || "",
      email: user?.email || "",
      username: user?.username || "",
      bio: user?.bio || "",
      avatarUrl: user?.avatarUrl || "",
    },
  });

  const onSubmit = (data) => {
    console.log("Submitted data:", data);
    toast.success("Profile updated successfully!");
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" className="flex-1 cursor-pointer">
          Edit Profile
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-zinc-900 text-zinc-100 border-0 shadow-lg absolute top-1/2 left-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <AlertDialogHeader className="px-6 pt-6">
            <AlertDialogTitle>Edit Your Profile</AlertDialogTitle>
            <AlertDialogDescription>
              Update your personal information and bio.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <CardContent className="space-y-5 py-4">
            <div className="flex items-center space-x-4">
              <img
                src={user?.avatarUrl || "/placeholder.svg"}
                alt="Avatar"
                width="72"
                height="72"
                className="rounded-full border object-cover"
              />
              <div className="space-y-2">
                <Button
                  variant="secondary"
                  className="cursor-pointer bg-zinc-700 text-gray-50 hover:bg-zinc-800"
                >
                  Upload Your Avatar
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                placeholder="E.g. Jane Doe"
                {...register("fullname")}
              />
              {errors.fullname && (
                <p className="text-sm text-red-500">
                  {errors.fullname.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="E.g. jane@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="E.g. janedoe"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biography</Label>
              <Textarea
                id="bio"
                placeholder="Tell us a little about yourself..."
                {...register("bio")}
              />
              {errors.bio && (
                <p className="text-sm text-red-500">{errors.bio.message}</p>
              )}
            </div>
          </CardContent>

          <AlertDialogFooter className="mt-4 px-6 pb-4">
            <AlertDialogCancel
              asChild
              className=" cursor-pointer text-gray-950 hover:text-gray-950"
            >
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </AlertDialogCancel>
            <Button
              type="submit"
              variant="secondary"
              className="cursor-pointer bg-green-700 text-gray-50 hover:bg-green-600"
            >
              Save Changes
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditProfileDialog;
