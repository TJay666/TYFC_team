export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#1d3557] text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 flex items-center">
            <img 
              src="/images/taoyuan_universe_logo.png" 
              alt="桃園獵鷹宇宙 Logo" 
              className="h-12 w-12 mr-3" 
            />
            <div>
              <h3 className="font-bold text-lg">桃園獵鷹宇宙</h3>
              <p className="text-sm text-white/70">專業足球隊管理系統</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <p className="text-sm text-white/70">
              &copy; {currentYear} 桃園獵鷹宇宙足球隊版權所有
            </p>
            <p className="text-xs text-white/50 mt-1">
              系統版本 v1.2.0
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
