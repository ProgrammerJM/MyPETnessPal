export default function About() {
  return (
    <div className="h-full my-10">
      <h1 className="text-5xl flex justify-center p-10">
        Learn About US: <span className="font-bold">Anytime PETness</span>
      </h1>
      <div className="flex justify-center">
        <img
          src="./src/assets/aboutus.png"
          className="w-auto h-auto max-w-[50%] max-h-[75%] mx-10"
        />
        <div className="flex flex-col w-96 mt-5 overflow-y-auto max-h-[calc(100vh-200px)] max-w-[50%]">
          <p className="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            fringilla nunc in molestie feugiat. Nunc auctor consectetur elit,
            quis pulvina. Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Nulla fringilla nunc in molestie feugiat. Nunc auctor
            consectetur elit, quis pulvina.
          </p>
          <br />
          <p className="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            fringilla nunc in molestie feugiat. Nunc auctor consectetur elit,
            quis pulvina. Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Nulla fringilla nunc in molestie feugiat. Nunc auctor
            consectetur elit, quis pulvina.
          </p>
          <br />
          <p className="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            fringilla nunc in molestie feugiat. Nunc auctor consectetur elit,
            quis pulvina. Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Nulla fringilla nunc in molestie feugiat. Nunc auctor
            consectetur elit, quis pulvina.
          </p>
        </div>
      </div>
    </div>
  );
}
