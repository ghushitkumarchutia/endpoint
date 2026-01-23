import TestApiForm from "../components/forms/TestApiForm";

const Playground = () => {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-3xl mx-auto text-center mb-8'>
        <h1 className='text-3xl font-bold mb-2'>API Playground</h1>
        <p className='text-muted-foreground'>
          Test your endpoints directly from the browser without CORS issues.
        </p>
      </div>

      <div className='max-w-4xl mx-auto'>
        <TestApiForm />
      </div>
    </div>
  );
};

export default Playground;
