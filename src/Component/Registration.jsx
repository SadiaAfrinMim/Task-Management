import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { imageUpload, saveUser } from '../Api/utils';
import { AuthContext } from '../AuthProvider/AuthProvider';

const Registration = () => {
    useEffect(() => {
        AOS.init({ duration: 2000 });
    }, []);

    const navigate = useNavigate();
    const { createUser, signInWithGoogle, updateUserProfile } = useContext(AuthContext);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    // ✅ Password Validation Function
    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    };

    // ✅ Form Validation Function
    const validateForm = (name, email, password, image) => {
        const newErrors = {};

        if (name.trim().length < 3) {
            newErrors.name = 'Name must be at least 3 characters long.';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        if (!validatePassword(password)) {
            newErrors.password =
                'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.';
        }

        if (!image) {
            newErrors.image = 'Please select a profile image.';
        } else if (!image.type.startsWith('image/')) {
            newErrors.image = 'Please select a valid image file.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ✅ Handle Sign Up
    const handleSignUp = async (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const password = form.password.value;
        const image = form.image.files[0];

        if (!validateForm(name, email, password, image)) {
            return;
        }

        try {
            const photoURL = await imageUpload(image);
            const result = await createUser(email, password);
            await updateUserProfile(name, photoURL);
            await saveUser({ ...result?.user, displayName: name, photoURL });

            toast.success('Signup Successful! Redirecting...');
            navigate('/'); // ✅ রিডাইরেক্ট হোম পেজে
        } catch (err) {
            toast.error(err?.message || 'Something went wrong!');
        }
    };

    // ✅ Handle Google Sign In
    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
            toast.success('Signin Successful! Redirecting...');
            navigate('/'); // ✅ রিডাইরেক্ট হোম পেজে
        } catch (err) {
            toast.error(err?.message || 'Something went wrong!');
        }
    };

    return (
        <div data-aos="zoom-in" className="flex justify-center items-center min-h-screen my-12">
            <div className="flex w-full max-w-lg mx-auto overflow-hidden rounded-lg shadow-lg border p-8">
                <div className="w-full">
                    <h2 className="text-xl text-center text-gray-600">Get Your Free Account Now</h2>

                    {/* ✅ Google Login Button */}
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full mt-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                    >
                        Sign in with Google
                    </button>

                    <div className="mt-4 text-center text-gray-500">or register with email</div>

                    {/* ✅ Signup Form */}
                    <form onSubmit={handleSignUp} className="mt-4">
                        {/* Name Input */}
                        <input
                            name="name"
                            type="text"
                            placeholder="Username"
                            className={`w-full p-2 border rounded mb-2 ${errors.name ? 'border-red-500' : ''}`}
                            required
                        />
                        {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}

                        {/* Email Input */}
                        <input
                            name="email"
                            type="email"
                            placeholder="Email Address"
                            className={`w-full p-2 border rounded mb-2 ${errors.email ? 'border-red-500' : ''}`}
                            required
                        />
                        {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}

                        {/* Image Upload */}
                        <input
                            name="image"
                            type="file"
                            accept="image/*"
                            className={`w-full p-2 border rounded mb-2 ${errors.image ? 'border-red-500' : ''}`}
                            required
                        />
                        {errors.image && <p className="text-red-600 text-sm">{errors.image}</p>}

                        {/* Password Input */}
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : ''}`}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}

                        {/* ✅ Fixed Signup Button */}
                        <button type="submit" className="w-full py-2 mt-4 text-white bg-cyan-500 rounded">
                            Sign Up
                        </button>
                    </form>

                    {/* ✅ Login Redirect */}
                    <div className="mt-6 text-sm text-center text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:underline">
                            Log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registration;
