const ScrollTest= ()=> {
    return (
      <div className="h-64 overflow-y-scroll scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-300 p-4">
        {Array.from({ length: 40 }, (_, i) => (
          <div key={i} className="mb-2">
            Line {i + 1}
          </div>
        ))}
      </div>
    );
  }
  export default ScrollTest;