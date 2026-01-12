import { FaExchangeAlt, FaDollarSign, FaMobileAlt } from "react-icons/fa";

const CardsSectionComponent = () => {
  return (
    <section className="mt-10 px-4">
      <h2
        className="text-3xl font-bold text-center mb-8"
        style={{ color: "#d7a825" }}
      >
        Why Swap with SwapConnect
      </h2>
      <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto">
        {/* Card 1 */}
        <div className="flex-1 bg-gray-300 dark:bg-gray-700 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
          <FaExchangeAlt size={40} className="mb-3 text-[#037f44]" />
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
            Upgrade Hassle-Free
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            Say goodbye to the hassle of selling your old device privately. Our
            swapping process is quick, easy, and hassle-free.
          </p>
        </div>
        {/* Card 2 */}
        <div className="flex-1 bg-gray-300 dark:bg-gray-700 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
          <FaDollarSign size={40} className="mb-3 text-[#037f44]" />
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
            Maximize Value
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            Get the most value for your old device with our competitive trade-in
            offers.
          </p>
        </div>
        {/* Card 3 */}
        <div className="flex-1 bg-gray-300 dark:bg-gray-700 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
          <FaMobileAlt size={40} className="mb-3 text-[#037f44]" />
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
            Wide Selection
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            Explore a wide range of the latest tech devices, ensuring you find
            the perfect upgrade.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CardsSectionComponent;
