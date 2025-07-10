import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LogoutDialog from "../components/LogoutDialog";
import SpinLoader from "../../shared/components/SpinLoader";
import EditProfile from "../components/EditProfile";
import { useSelector } from "react-redux";

const ProfilePage = () => {
  let user = useSelector((state) => state.auth.user);
  let isLoading = useSelector((state) => state.auth.isLoading);
  console.log("User in ProfilePage: ", user);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 to-zinc-900 text-zinc-100 px-4 py-10">
        <SpinLoader />
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 to-zinc-900 text-zinc-100 px-4 py-10">
      {user ? (
        <Card className="w-full max-w-md animate-fade-in shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img
                src={user.avatarUrl}
                alt="Avatar"
                className="w-24 h-24 rounded-full border border-zinc-700 shadow-md"
              />
            </div>
            <CardTitle className="text-2xl">{user.fullname}</CardTitle>
            <CardDescription>@{user.username}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-sm text-zinc-400 text-center flex flex-col items-center">
              <span className="font-bold">{user.bio}</span>
              <span className="font-semibold">{user.email}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <EditProfile user={user} />
              <LogoutDialog />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div>User not found</div>
      )}
    </div>
  );
};

export default ProfilePage;
