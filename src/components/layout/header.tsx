export const Header = () => {
    return(
        <div className="text-center py-4 grid place-items-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            
            <h1 className="text-4xl font-bold  text-black">
              Text-to-Speech Studio
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 w-[80%] text-center">
            Transform your text into natural-sounding speech with AI
          </p>
        </div>
    )
}