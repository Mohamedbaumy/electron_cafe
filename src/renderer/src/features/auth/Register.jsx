import lightBg from "/assets/img/bg-light.webp";
import img from "/assets/img/register-ar.webp";
import Login from "./Login";

const Register = () => {
	return (
		<div style={{ backgroundImage: `url(${lightBg})`, direction: "rtl" }}>
			<div className="block min-h-screen items-center justify-between gap-10 p-20 md:flex">
				<div className="mb-16 flex-1 md:mb-0 ">
					<Login />
				</div>
				<div className="flex flex-1 items-center justify-center">
					<img src={img} alt="" className="w-[450px] rounded-xl" />
				</div>
			</div>
		</div>
	);
};

export default Register;
