import React,{useState,useEffect, useRef} from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { setLoading } from '@/app/redux/slices/profileSlice';
import { updateProfilePicture } from '@/services/userService';
import Image from 'next/image';
const ChangeProfilePicture = () => {
    const {user} = useSelector((state)=>(state.profile));
    const dispatch=useDispatch();
    const [imageFile,setImageFile] = useState(null);
    const [previewSource,setPreviewSource] = useState("");
    const fileInputRef = useRef(null);
    const [loading,setLoading]=useState(false);
    useEffect(() => {
        if(!imageFile) return;
        previewFile(imageFile)
    }, [imageFile]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if(file) {
            setImageFile(file);
            previewFile(file)
        }
    }
    const previewFile = (file) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        setPreviewSource(reader.result)
      }
    }
    const uploadHandler = async () => {
        if (!imageFile) return;
        const formData = new FormData();
        formData.append("image", imageFile);
        try {
          setLoading(true)
          dispatch(updateProfilePicture(formData))
        } catch (error) {
          console.error("Issue in Changing Picture")
        }finally{
          setLoading(false)
        }
    }

    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-3xl rounded-md p-4 sm:p-6 flex flex-col lg:flex-row items-center gap-6">
          <Image
            unoptimized
            width={100}
            height={100}
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover rounded-full border-4 border-blue-200/60 shadow-lg"
            src={previewSource || user?.image}
            alt={user?.firstName || "Profile"}
          />

          <div className="flex-1 flex flex-col items-center lg:items-start gap-4 w-full">
            <p className="text-lg font-semibold text-center lg:text-left text-blue-400">
              Change Profile Picture
            </p>

            <div className="w-full flex flex-col sm:flex-row items-center sm:items-stretch gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: "none" }}
                aria-hidden
              />

              <button
                type="button"
                className="w-full sm:w-auto px-4 py-2 rounded-md bg-richblack-700 border-b border-richblack-200 text-white"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Select profile picture"
              >
                Select
              </button>

              <button
                type="button"
                className={`w-full sm:w-auto px-4 py-2 rounded-md text-black ${
                  loading ? "bg-yellow-200" : "bg-yellow-300"
                }`}
                onClick={uploadHandler}
                disabled={!imageFile || loading}
                aria-label="Upload profile picture"
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
}

export default ChangeProfilePicture