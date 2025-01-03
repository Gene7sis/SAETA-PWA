"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from "firebase/database";
import { auth, database } from '../../firebaseConfig';


export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);


  const handleRegister = async (e) => {
    e.preventDefault();
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
        // Obtener el UID del usuario recién registrado
        const uid = userCredential.user.uid;
  
        // Guardar el nombre de usuario y otros datos en la base de datos en tiempo real
        await set(ref(database, 'users/' + uid), {
          username: username,
          email: email
        });
  
        router.push("/login");
    } catch (error) {
        if (error.code === 'auth/weak-password') {
            setError("La contraseña es demasiado débil.");
          } else if (error.code === 'auth/email-already-in-use') {
            setError("Este correo electrónico ya está en uso.");
          } else {
            setError("Error al registrarse: " + error.message);
          }
    }
  };

  return (
    <>
      <div className="justify-center items-center flex flex-col">
        <section className="flex flex-col bg-[#3A9EC2] border border-gray-300 rounded-xl gap-6 row-start-2 items-center shadow-xl p-6 sm:max-w-md sm:w-full">
          <h1 className="text-center text-2xl font-bold pt-4">
            Registrarse
          </h1>

          <Image
            className="justify-center"
            src="/icon512_rounded.png"
            alt="App logo"
            width={100}
            height={100}
            priority
          />

          <form className="flex flex-col gap-4 w-full pt-6 justify-center" onSubmit={handleRegister}>
          <div className="w-full">
              <label htmlFor="username" className="block text-sm font-medium ">Nombre de Usuario</label>
              <input
                type="text"
                name="username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6BC5E8] sm:text-sm"
                placeholder="Tu nombre de usuario"
              />
            </div>

            <div className="w-full">
              <label htmlFor="email" className="block text-sm font-medium ">Correo electrónico</label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6BC5E8] sm:text-sm"
                placeholder="Tu correo electrónico"
              />
            </div>

            <div className="w-full">
              <label htmlFor="password" className="block text-sm font-medium ">Contraseña</label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6BC5E8] sm:text-sm"
                placeholder="Tu contraseña"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-black text-white gap-2 hover:bg-[#6BC5E8] text-sm sm:text-base h-10 sm:h-12 px-4 hover:shadow-lg"
            >
              Registrarse
            </button>
          </form>

          <div className="w-full text-center mt-4">
            <p className="text-white">¿Ya tienes una cuenta?</p>
            <Link href="/login" className="text-sm text-white hover:text-black underline">
              Inicia sesión aquí
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}