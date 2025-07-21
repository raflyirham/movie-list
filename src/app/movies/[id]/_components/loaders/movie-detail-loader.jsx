import { Skeleton } from "@/components/ui/skeleton";

export default function MovieDetailLoader() {
  return (
    <div className="flex flex-col rounded-md shadow-md">
      <div className="w-full h-[500px] bg-primary-foreground rounded-md relative">
        <div className="absolute top-0 left-0 w-full h-full rounded-md z-10">
          <Skeleton className="w-full h-full bg-primary/50" />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-6 -mt-72 z-20 px-8 py-8">
        <div className="flex flex-col items-center lg:items-start gap-4 lg:gap-2">
          <div className="w-[300px] h-[400px] rounded-md relative">
            <Skeleton className="w-full h-full bg-primary/50" />
          </div>

          <Skeleton className="w-full h-[40px] bg-primary/50" />

          <div className="flex flex-row justify-center lg:justify-start items-center lg:items-start lg:flex-col gap-4 mt-4 w-full">
            <Skeleton className="w-[100px] lg:w-full h-[20px] bg-primary/50" />
            <Skeleton className="w-[100px] lg:w-full h-[20px] bg-primary/50" />
            <Skeleton className="w-[100px] lg:w-full h-[20px] bg-primary/50" />
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-10 lg:mt-42 w-full">
          <Skeleton className="w-[400px] h-[50px] bg-primary/50" />

          <div className="flex flex-col gap-6 mt-4 lg:mt-12 w-full">
            <div className="flex flex-col gap-4 w-full">
              <Skeleton className="w-[150px] h-[20px] bg-primary/50" />
              <Skeleton className="w-full h-[200px] bg-primary/50" />
            </div>

            <div className="flex flex-col gap-4">
              <Skeleton className="w-[150px] h-[20px] bg-primary/50" />

              <div className="flex flex-row gap-1 flex-wrap">
                <Skeleton className="w-[100px] h-[20px] bg-primary/50" />
                <Skeleton className="w-[100px] h-[20px] bg-primary/50" />
                <Skeleton className="w-[100px] h-[20px] bg-primary/50" />
                <Skeleton className="w-[100px] h-[20px] bg-primary/50" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
