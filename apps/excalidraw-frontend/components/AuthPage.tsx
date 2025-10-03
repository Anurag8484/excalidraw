'use client'

export function AuthPage({isSignin}:{
    isSignin: boolean
}){
    return (
      <div className="h-screen w-screen flex justify-center items-center ">
        <div className="bg-black text-white rounded-2xl p-10 flex gap-3 flex-col">
          <div className="text-center font-bold text-xl">
            {isSignin ? <h2 className="">Sign In</h2> : <h3>Sign up</h3>}
          </div>
          <div className=" flex gap-3 flex-col">
            <input
              type="text"
              placeholder="Name"
              className="outline-1 rounded-sm px-2 py-1 outline-white"
            />
            <input
              type="password"
              placeholder="Password"
              className="outline-1 rounded-sm px-2 py-1 outline-white"
            />
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="outline-1 rounded-sm px-2 py-1 outline-white"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="outline-1 rounded-sm px-2 py-1 outline-white"
            />
          </div>
          <div className="flex justify-center">
            {isSignin ? (
              <button
                onClick={() => {}}
                className="bg-amber-50 text-black shadow-md rounded-md py-1 px-2"
              >
                {" "}
                Sign In
              </button>
            ) : (
              <button
                onClick={() => {}}
                className="bg-amber-50 text-black shadow-md rounded-md py-1 px-2"
              >
                Sign Up
              </button>
            )}
          </div>
        </div>
        <div></div>
      </div>
    );
}