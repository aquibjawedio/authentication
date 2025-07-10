import RegisterForm from "../components/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="w-screen h-screen grid place-items-center bg-gradient-to-br from-zinc-950 to-zinc-900 text-zinc-100 px-4 py-10">
      <div className="w-full max-w-md animate-fade-in">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
