import { Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import useForm from "../../hooks/useForm";
import TextInput from "../../components/TextInput";
import CustomButton from "../../components/CustomButton";
import { notification } from "../../configs/notification.config";
import { useDispatch } from "react-redux";
import "./style.css";
import { setUserData } from "../../store/user/userReducer";
import { FaUser } from "react-icons/fa";
import { customLocalStorage } from "../../utils/customLocalStorage";
import { signup } from "../../api/auth.api";
import { CiPhone } from "react-icons/ci";

const formFields = [
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    required: true,
    StartIcon: FaUser,
    validation: (value: string) =>
      value.length >= 3 ? null : "Password must be at least 3 characters long",
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    required: true,
    StartIcon: FaUser,
    validation: (value: string) =>
      value.length >= 3 ? null : "Password must be at least 3 characters long",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    StartIcon: MdOutlineAlternateEmail,
    validation: (value: string) =>
      /^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email format",
  },
  {
    name: "phone",
    label: "Contact Number",
    type: "text",
    required: true,
    StartIcon: CiPhone,
    validation: (value: string) =>
      value.length === 10 ? null : "Invalid Contact Number",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    required: true,
    StartIcon: RiLockPasswordFill,
    validation: (value: string) =>
      value.length >= 6 ? null : "Password must be at least 6 characters long",
  },
];

const Signup = () => {
  const { formData, errors, handleChange, handleSubmit, loading } =
    useForm(formFields);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignup = async (data: { [key: string]: string }) => {
    try {
      const result = await signup(data);
      customLocalStorage.setData("token", result.token);
      dispatch(setUserData(result.user));
      let prevUrl = new URLSearchParams(location.search).get("prevUrl") || "/";
      if (prevUrl.includes("/signin") || prevUrl.includes("/signup")) {
        prevUrl = "/";
      }
      navigate(prevUrl);
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error", error.message);
        notification.error(error.message);
      }
    }
  };

  return (
    <Box>
      <h2 className="title">Signup Form</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        {formFields.map((field) => (
          <TextInput
            key={field.name}
            name={field.name}
            type={field.type}
            required={field.required}
            StartIcon={field.StartIcon}
            onChange={handleChange}
            placeholder={field.label}
            value={formData[field.name]}
            error={errors[field.name]}
          />
        ))}
        <CustomButton
          name="Sign up"
          loading={loading}
          type="submit"
          variant="contained"
          onClick={() => handleSubmit(handleSignup)}
        />
      </form>
      <span>
        Click here to <Link to="/signin">login</Link>
      </span>
    </Box>
  );
};

export default Signup;
