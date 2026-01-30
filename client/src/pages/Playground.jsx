import TestApiForm from "../components/forms/TestApiForm";

const Playground = () => {
  return (
    <div className='flex flex-col px-4 py-[20px] md:px-6 md:py-[22px] bg-[#f5f5f6] rounded-3xl h-auto overflow-visible lg:h-full lg:overflow-y-auto custom-scrollbar'>
      <div className='max-w-4xl mx-auto w-full pt-10 md:pt-16 pb-8 md:pb-16 flex-1 flex flex-col'>
        <div className='max-w-2xl mx-auto text-center mb-8 md:mb-10'>
          <h1 className='text-[22px] md:text-2xl font-dmsans text-gray-900 mb-2'>
            API Playground
          </h1>
          <p className='md:text-base text-[13px] text-gray-500 font-bricolage'>
            Test your endpoints directly from the browser without CORS issues.
          </p>
        </div>

        <div className='w-full'>
          <TestApiForm />
        </div>
      </div>
    </div>
  );
};

export default Playground;
