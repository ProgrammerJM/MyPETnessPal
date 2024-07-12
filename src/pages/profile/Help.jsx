import { FaDog } from "react-icons/fa";
import { FaCat } from "react-icons/fa";

export default function Help() {
  return (
    <>
      <div className="flex flex-col md:flex-row">
        <div className="bg-lavender-light min-h-screen flex items-center justify-center md:w-1/2">
          <div className="container mx-auto p-4">
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <div className="flex items-center justify-center p-4">
                <FaDog className="self-center stroke-2 h-10 w-10 md:mx-3" />
                <h1 className="text-3xl font-bold text-purple-800">
                  Dog Activity Level Guide
                </h1>
              </div>

              <table className="min-w-full bg-white border border-gray-200 mb-8">
                <thead>
                  <tr className="">
                    <th className="py-2 px-4 border-b text-center text-lavender-dark">
                      Activity Level
                    </th>
                    <th className="py-2 px-4 border-b text-center text-lavender-dark">
                      Definition / Guide
                    </th>
                    <th className="py-2 px-4 border-b text-center text-lavender-dark">
                      RER Multiplier
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b">Intact</td>
                    <td className="py-2 px-4 border-b">
                      Dogs that have not been spayed or neutered.
                    </td>
                    <td className="py-2 px-4 border-b text-center">1.8</td>
                  </tr>
                  <tr className="bg-lavender">
                    <td className="py-2 px-4 border-b">Neutered</td>
                    <td className="py-2 px-4 border-b">
                      Dogs that have been spayed or neutered.
                    </td>
                    <td className="py-2 px-4 border-b text-center">1.6</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b">Obesity Prone</td>
                    <td className="py-2 px-4 border-b">
                      Dogs prone to gaining weight easily.
                    </td>
                    <td className="py-2 px-4 border-b text-center">1.4</td>
                  </tr>
                  <tr className="bg-lavender">
                    <td className="py-2 px-4 border-b">Weight Loss</td>
                    <td className="py-2 px-4 border-b">
                      Dogs that need to lose weight.
                    </td>
                    <td className="py-2 px-4 border-b text-center">1.0</td>
                  </tr>
                  <tr className="bg-lavender">
                    <td className="py-2 px-4 border-b">Sedentary</td>
                    <td className="py-2 px-4 border-b">
                      Dogs with very low activity levels.
                    </td>
                    <td className="py-2 px-4 border-b text-center">1.2</td>
                  </tr>
                  <tr className="bg-lavender">
                    <td className="py-2 px-4 border-b">Moderate</td>
                    <td className="py-2 px-4 border-b">
                      Dogs with a typical activity level.
                    </td>
                    <td className="py-2 px-4 border-b text-center">1.4</td>
                  </tr>
                  <tr className="bg-lavender">
                    <td className="py-2 px-4 border-b">Active</td>
                    <td className="py-2 px-4 border-b">
                      Dogs engaged in regular, vigorous activity.
                    </td>
                    <td className="py-2 px-4 border-b text-center">1.6</td>
                  </tr>
                  <tr className="bg-lavender">
                    <td className="py-2 px-4 border-b">
                      Highly Active / Working Dogs
                    </td>
                    <td className="py-2 px-4 border-b">
                      Dogs involved in strenuous activities or work.
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      1.8 - 2.0
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-lavender-light min-h-screen flex items-center justify-center md:w-1/2">
          <div className="container mx-auto p-4">
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <div className="flex items-center justify-center p-4">
                <FaCat className="self-center stroke-2 h-10 w-10 md:mx-3" />
                <h1 className="text-3xl font-bold text-purple-800">
                  Cat Activity Level Guide
                </h1>
              </div>
              <table className="min-w-full bg-white border border-gray-200 mb-8">
                <thead>
                  <tr className="bg-lavender">
                    <th className="py-2 px-4 border-b text-center text-lavender-dark">
                      Activity Level
                    </th>
                    <th className="py-2 px-4 border-b text-center text-lavender-dark">
                      Definition / Guide
                    </th>
                    <th className="py-2 px-4 border-b text-center text-lavender-dark">
                      RER Multiplier
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b">Intact</td>
                    <td className="py-2 px-4 border-b">
                      Cats that are not neutered or spayed.
                    </td>
                    <td className="py-2 px-4 border-b text-center">1.4</td>
                  </tr>
                  <tr className="bg-lavender">
                    <td className="py-2 px-4 border-b">Neutered</td>
                    <td className="py-2 px-4 border-b">
                      Cats that have been neutered or spayed.
                    </td>
                    <td className="py-2 px-4 border-b text-center">1.2</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b">Obesity Prone</td>
                    <td className="py-2 px-4 border-b">
                      Cats that are prone to gaining weight easily.
                    </td>
                    <td className="py-2 px-4 border-b text-center">1.0</td>
                  </tr>
                  <tr className="bg-lavender">
                    <td className="py-2 px-4 border-b">Weight Loss</td>
                    <td className="py-2 px-4 border-b">
                      Cats that are on a diet to lose weight.
                    </td>
                    <td className="py-2 px-4 border-b text-center">0.8</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
