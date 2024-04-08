import { useEffect, useState, useMemo } from "react";
import { db, auth, storage } from "../../config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

export default function PetProfile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [petList, setPetList] = useState([]);

  // New Pet States
  const [newPetName, setNewPetName] = useState("");
  const [newPetType, setNewPetType] = useState("");
  const [newPetWeight, setNewPetWeight] = useState(0);
  const [newPetActivityLevel, setNewPetActivityLevel] = useState(0);

  // Update Activity Level State
  const [updatedPetActivityLevel, setUpdatedPetActivityLevel] = useState(0);

  // File Upload State
  const [file, setFile] = useState(null);
  // const [imageList, setImageList] = useState([]);
  const [data, setData] = useState({});
  const [per, setPerc] = useState(null);

  const petCollectionRef = useMemo(() => collection(db, "pets"), []);

  const getPetList = async () => {
    try {
      const data = await getDocs(petCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setPetList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getPetList();
  }, []);

  // Function to toggle the modal state
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;

      console.log(name);
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setPerc(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({ ...prev, img: downloadURL }));
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  // Function to handle saving data to Firestore
  const onSavePet = async () => {
    // Add your Firestore logic here
    try {
      await addDoc(petCollectionRef, {
        name: newPetName,
        petType: newPetType,
        weight: newPetWeight,
        activityLevel: newPetActivityLevel,
        userId: auth?.currentUser?.uid,
        imageURL: data,
      });

      getPetList();
      console.log("Data saved to Firestore");
    } catch (err) {
      console.error(err);
    }
    setIsModalOpen(!isModalOpen);
  };

  const deletePet = async (id) => {
    const petDocument = doc(db, "pets", id);
    await deleteDoc(petDocument);
  };
  const updatePetActivityLevel = async (id) => {
    const petDocument = doc(db, "pets", id);
    await updateDoc(petDocument, { activityLevel: updatedPetActivityLevel });
  };

  // const imageListRef = ref(storage, "petImages/");
  const uploadFile = async () => {
    if (!file) return;
    const filesFolderRef = ref(storage, `petImages/${file.name}`);
    try {
      await uploadBytes(filesFolderRef, file);
      alert("image uploaded");
    } catch (err) {
      console.error(err);
    }
  };

  // useEffect(() => {
  //   const uploadFile = () => {
  //     const name = new Date().getTime() + file.name;
  //     const storageRef = ref(storage, fileUpload.name);
  //   };
  //   file && uploadFile();
  // }, [fileUpload]);

  // useEffect(() => {
  //   listAll(imageListRef).then((res) => {
  //     res.items.forEach((item) => {
  //       getDownloadURL(item).then((url) => {
  //         setImageList((prev) => [...prev, url]);
  //       });
  //     });
  //   });
  // }, []);

  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={toggleModal}
      >
        + Add Pet
      </button>
      <div>
        {petList.map((pet) => (
          <div key={pet.id}>
            <img src={pet.imageURL} />
            <h1>Name : {pet.name}</h1>
            <p>Pet Type : {pet.petType}</p>
            <p>Weight (KG) : {pet.weight}</p>
            <p>Pet Activity Level : {pet.activityLevel}</p>
            <button onClick={() => deletePet(pet.id)}>Delete Pet</button>
            <input
              placeholder="New Pet's Activity Level"
              onChange={(e) =>
                setUpdatedPetActivityLevel(Number(e.target.value))
              }
            />
            <button onClick={() => updatePetActivityLevel(pet.id)}>
              Update Activity Level
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-md">
            <button
              className="absolute top-0 right-0 m-4 p-4 text-white hover:text-gray-800 border"
              onClick={toggleModal}
            >
              &times;
            </button>
            <h1>CREATE PROFILE</h1>
            <hr />
            <div className="flex justify-center m-10">
              <img
                src={
                  file
                    ? URL.createObjectURL(file)
                    : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                }
                alt=""
                className="h-48 flex"
              />
            </div>
            <div className="flex items-center">
              <div className="m-12 p-5"></div>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
              <button onClick={uploadFile}>Upload Image</button>
            </div>
            <div>
              <input
                placeholder="Name"
                onChange={(e) => setNewPetName(e.target.value)}
                className="pl-2"
              />
              <input
                placeholder="Pet Type"
                onChange={(e) => setNewPetType(e.target.value)}
                className="pl-2"
              />
              <input
                placeholder="Weight in KG"
                type="number"
                onChange={(e) => setNewPetWeight(Number(e.target.value))}
                className="pl-2"
              />
              <input
                placeholder="Pet's Activity Level"
                type="number"
                onChange={(e) => setNewPetActivityLevel(Number(e.target.value))}
                className="pl-2"
              />
            </div>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={onSavePet}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
