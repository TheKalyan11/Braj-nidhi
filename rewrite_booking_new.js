const fs = require('fs');
const filePath = 'src/app/booking/page.tsx';
const content = fs.readFileSync(filePath, 'utf-8');

const lines = content.split('\n');
let returnIdx = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === 'return (' && lines[i+1].includes('className="booking-page-mmt"')) {
        returnIdx = i;
        break;
    }
}

if (returnIdx === -1) {
    console.error("Could not find 'return ('");
    process.exit(1);
}

const logicLines = lines.slice(0, returnIdx + 1).join('\n');

const newJsx = `    <div className="min-h-screen bg-[#f8f7f4] text-[#1a1512] font-outfit pb-24 pt-32">
      {/* 1. STUNNING HEADER NAVIGATION */}
      <header id="main-header" className={headerScrolled ? "scrolled" : ""}>
        <Link href="/" className="logo" style={{ textDecoration: 'none' }}>
          <img src="/Braj_nidhi_.png" alt="Braj Nidhi Logo" style={{ height: "60px", width: "auto" }} />
        </Link>
        <nav>
          <ul>
            <li><a href="/guesthouse">Guesthouse</a></li>
            <li><a href="/weddings">Weddings</a></li>
            <li><a href="/corporate">Corporate</a></li>
            <li><a href="/braj-yatra">Braj Yatra</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
        <div className="nav-btns">
          {isLoggedIn ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginRight: '10px' }}>
                <div className="user-info-text">
                  <span className="user-label">Braj Club Member</span>
                  <span className="user-name">{userName}</span>
                </div>
              </div>
              <button onClick={handleLogout} className="btn-login">Logout</button>
            </>
          ) : (
            <button onClick={() => setLoginModalOpen(true)} className="btn-login">Login / Join</button>
          )}
          <a href="/booking" className="btn-book">Book Now</a>
        </div>
        <div className="mobile-header-actions" style={{display: 'none'}}>
            {isLoggedIn ? (
                <button onClick={handleLogout} className="mobile-logout-btn">Logout</button>
            ) : (
                <button onClick={() => setLoginModalOpen(true)} className="mobile-login-join">Login / Join</button>
            )}
            <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex justify-end" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-[80%] max-w-[320px] h-full bg-white shadow-2xl p-6 flex flex-col justify-between" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-10 border-b border-gray-100 pb-5">
              <img src="/Braj_nidhi_.png" alt="Braj Nidhi Logo" className="h-[45px] w-auto" />
              <button className="p-1 text-gray-800" onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-6">
              <a href="/guesthouse" className="text-lg font-semibold text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>Guesthouse</a>
              <a href="/weddings" className="text-lg font-semibold text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>Weddings</a>
              <a href="/corporate" className="text-lg font-semibold text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>Corporate</a>
              <a href="/braj-yatra" className="text-lg font-semibold text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>Braj Yatra</a>
              <a href="/contact" className="text-lg font-semibold text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
            </div>
            <div className="border-t border-gray-100 pt-6 mt-auto flex flex-col gap-3">
              {isLoggedIn ? (
                <div className="flex flex-col gap-1 mb-2">
                  <span className="text-[9px] uppercase tracking-wider text-gray-500 font-medium">Braj Club Member</span>
                  <span className="text-[15px] font-bold text-[#8b0000]">{userName}</span>
                  <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="w-full mt-2 py-2 border border-gray-300 rounded-full font-bebas text-lg">Logout</button>
                </div>
              ) : (
                <button onClick={() => { setLoginModalOpen(true); setIsMobileMenuOpen(false); }} className="w-full py-2 border border-gray-300 rounded-full font-bebas text-lg">Login / Create Account</button>
              )}
              <a href="/booking" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-2 bg-black text-white rounded-full text-center font-bebas text-lg mt-1">Book Now</a>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-[1240px] mx-auto px-5">
        {currentStep === 1 && (
          <div className="animate-in fade-in duration-500">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-[#FAF7F2] to-[#F1EADF] border border-[#e7decb] rounded-2xl p-8 md:p-10 mb-10 shadow-sm flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bebas text-[#7b4f15] tracking-wide mb-4 leading-tight">Reserve Your Heritage Stay with Comfort & Devotion</h1>
                <p className="text-[#61564f] text-[15px] leading-relaxed mb-8">Complete your premium booking with curated guest services, secure payment, and exclusive member rewards crafted for the perfect Vrindavan retreat.</p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[170px] bg-white rounded-xl border border-[#e7decb] p-4 shadow-sm">
                    <h3 className="font-bebas text-xl text-[#8b0000] tracking-wider mb-1">{getRoomTitle(roomType)}</h3>
                    <p className="text-[#6e5e52] text-sm font-medium">Luxury suite tailored for your selected group size with heritage-inspired décor.</p>
                  </div>
                  <div className="flex-1 min-w-[170px] bg-white rounded-xl border border-[#e7decb] p-4 shadow-sm">
                    <h3 className="font-bebas text-xl text-[#8b0000] tracking-wider mb-1">{nights} Nights</h3>
                    <p className="text-[#6e5e52] text-sm font-medium">Flexible stay dates with welcome breakfast and spiritual amenities.</p>
                  </div>
                  <div className="flex-1 min-w-[170px] bg-white rounded-xl border border-[#e7decb] p-4 shadow-sm">
                    <h3 className="font-bebas text-xl text-[#8b0000] tracking-wider mb-1">{adults} Adults / {children} Children</h3>
                    <p className="text-[#6e5e52] text-sm font-medium">Choose your ideal family or friends configuration for a seamless check-in.</p>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 w-full md:w-auto text-right">
                <Image src="/DSC05963-HDR.webp" alt="Premium suite preview" width={420} height={300} className="w-full md:w-[420px] h-auto rounded-2xl shadow-xl object-cover" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[7.5fr_4.5fr] gap-8 items-start">
              
              {/* LEFT COLUMN */}
              <div className="flex flex-col gap-8">
                
                {/* Login Banner Promo */}
                {!isLoggedIn && (
                  <div className="bg-gradient-to-br from-[#d4af3710] to-[#8b000008] border-[1.5px] border-dashed border-[#d6cca9] rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-[#8b000015] text-[#8b0000] flex items-center justify-center shrink-0">
                        <Sparkles size={20} />
                      </div>
                      <div>
                        <h4 className="text-[15px] font-bold text-[#1a1512] mb-1">Log in or Create an Account for an Extra 10% Member Discount!</h4>
                        <p className="text-[13.5px] text-[#635b54] m-0">Unlock exclusive heritage member pricing and instant guest details autofill.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button 
                        onClick={() => { setLoginModalInitialRegister(false); setLoginModalOpen(true); }} 
                        className="px-4 py-2 border-[1.5px] border-[#8b0000] text-[#8b0000] font-bold text-[13px] rounded-md hover:bg-[#8b000008] transition-colors"
                      >
                        Login
                      </button>
                      <button 
                        onClick={() => { setLoginModalInitialRegister(true); setLoginModalOpen(true); }} 
                        className="px-4 py-2 bg-[#8b0000] text-white font-bold text-[13px] rounded-md flex items-center gap-2 hover:bg-[#730000] shadow-md transition-all hover:shadow-lg"
                      >
                        <Sparkles size={13} /> Create Account
                      </button>
                    </div>
                  </div>
                )}

                {/* Card 1: Review Room Details */}
                <div className="bg-white rounded-2xl border border-[#e3e1d9] p-6 md:p-8 shadow-sm hover:border-[#d1cfc5] hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between border-b border-[#f1efe8] pb-4 mb-6">
                    <div className="text-xl font-bold text-[#1a1512] flex items-center gap-3">
                      <Compass size={20} className="text-[#8b0000]" />
                      <span>Review Your Spiritual Stay Details</span>
                    </div>
                    <span className="bg-[#16a34a15] border border-[#16a34a40] text-[#15803d] text-xs font-bold px-3 py-1.5 rounded-md">Instant Confirmation</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[3.5fr_6.5fr] gap-6">
                    <div className="relative h-[200px] md:h-auto rounded-xl overflow-hidden shadow-inner">
                      <Image src={getRoomImage(roomType)} alt="Selected suite" fill className="object-cover" />
                      <div className="absolute top-3 left-3 bg-[#8b0000] text-white text-[10px] font-bold px-2.5 py-1.5 rounded shadow-md uppercase tracking-wider">Best Choice</div>
                    </div>
                    
                    <div className="flex flex-col">
                      <h3 className="font-bebas text-3xl text-[#1a1512] tracking-wide mb-3">{getRoomTitle(roomType)}</h3>
                      
                      <div className="flex items-center gap-3 mb-4">
                        <span className="bg-[#003580] text-white font-bold text-[15px] px-2.5 py-1.5 rounded-md leading-none">9.8</span>
                        <div className="flex flex-col leading-tight">
                          <span className="font-bold text-[13.5px] text-[#003580]">Exceptional</span>
                          <span className="text-xs text-[#635b54] font-medium">124 reviews · Braj Nidhi Guest Favorite</span>
                        </div>
                      </div>
                      
                      <div className="bg-[#fcfbfa] border border-[#e3e1d9] rounded-lg p-2.5 text-[12.5px] font-semibold text-[#4C463F] flex items-center gap-2 mb-4">
                        <span className="text-sm">📍</span>
                        <span>Excellent location — near Prem Mandir, Raman Reti, Vrindavan (9.5/10 location score)</span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-6">
                        <span className="text-xs font-semibold px-3 py-1.5 rounded bg-[#d4af3715] border border-[#d4af3740] text-[#a37f1c]">Spiritual Garden View</span>
                        <span className="text-xs font-semibold px-3 py-1.5 rounded bg-[#f1efe8] border border-[#dcdad2] text-[#423b35]">King-size Bed</span>
                        <span className="text-xs font-semibold px-3 py-1.5 rounded bg-[#16a34a15] border border-[#16a34a40] text-[#15803d]">Breakfast Included</span>
                        <span className="text-xs font-semibold px-3 py-1.5 rounded bg-[#f1efe8] border border-[#dcdad2] text-[#423b35]">Free high-speed WiFi</span>
                      </div>

                      {/* Interactive Stay Date Strip */}
                      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center bg-[#fcfbfa] border border-[#e3e1d9] rounded-xl p-4 gap-4 mt-auto">
                        <div className="text-center sm:text-left">
                          <h5 className="text-[10.5px] text-[#8c857b] uppercase font-bold tracking-wider mb-1">Check-In Date</h5>
                          <p className="text-[14.5px] font-bold text-[#1a1512]">{new Date(checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                        <div className="bg-[#8b000010] border border-[#8b000030] rounded-full px-4 py-1.5 text-[11.5px] font-bold text-[#8b0000] text-center mx-auto w-fit">
                          {nights} {nights === 1 ? 'Night' : 'Nights'}
                        </div>
                        <div className="text-center sm:text-right">
                          <h5 className="text-[10.5px] text-[#8c857b] uppercase font-bold tracking-wider mb-1">Check-Out Date</h5>
                          <p className="text-[14.5px] font-bold text-[#1a1512]">{new Date(checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Interactive Room & Guest Selections */}
                <div className="bg-white rounded-2xl border border-[#e3e1d9] p-6 md:p-8 shadow-sm hover:border-[#d1cfc5] hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between border-b border-[#f1efe8] pb-4 mb-6">
                    <div className="text-xl font-bold text-[#1a1512] flex items-center gap-3">
                      <Calendar size={20} className="text-[#8b0000]" />
                      <span>Customize Room & Calendar Selections</span>
                    </div>
                  </div>

                  {/* Real-time ERP Sync Status Bar */}
                  {isDevMode && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-6 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {isSearching ? (
                          <div className="w-4 h-4 rounded-full border-2 border-[#8b000020] border-t-[#8b0000] animate-spin"></div>
                        ) : (
                          <div className={\`w-2.5 h-2.5 rounded-full \${apiConnectionStatus === 'live' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : apiConnectionStatus === 'error' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-yellow-500 shadow-[0_0_8px_#eab308]'}\`}></div>
                        )}
                        <span className="text-[13px] font-semibold text-[#1a1512]">
                          {isSearching ? 'Syncing live inventory from ERP...' : 
                           apiConnectionStatus === 'live' ? 'Live ERP Connected' : 
                           apiConnectionStatus === 'error' ? 'ERP Sync Interrupted (Sandbox active)' : 
                           'Sandbox Simulator Active'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => searchRoomsApi(checkIn, checkOut, adults + children)}
                          disabled={isSearching}
                          className="bg-[#8b000010] text-[#8b0000] border border-[#8b000030] px-3 py-1.5 rounded-md text-xs font-bold hover:bg-[#8b0000] hover:text-white transition-colors disabled:opacity-50"
                        >
                          Search / Sync Rooms
                        </button>
                        <button 
                          onClick={() => setCredentialsOpen(true)}
                          className="bg-black text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-gray-800 transition-colors"
                        >
                          Setup Dev API Hub
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Grid Room Selector */}
                  <h4 className="text-[14px] font-bold text-gray-800 mb-3">Select Suite Category</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Deluxe 2 */}
                    {(() => {
                      const available = isCategoryAvailable('deluxe2');
                      return (
                        <div 
                          onClick={() => available && setRoomType('deluxe2')} 
                          className={\`relative border rounded-xl p-4 transition-all duration-200 \${roomType === 'deluxe2' ? 'border-[#8b0000] bg-[#8b000008] shadow-sm' : 'border-gray-300 bg-white hover:border-[#8b0000] hover:bg-gray-50'}\`}
                          style={{ opacity: available ? 1 : 0.5, cursor: available ? 'pointer' : 'not-allowed', pointerEvents: available ? 'auto' : 'none' }}
                        >
                          {roomType === 'deluxe2' && (
                            <div className="absolute top-0 right-0 w-0 h-0 border-solid border-t-0 border-r-[30px] border-b-[30px] border-l-0 border-r-[#8b0000] border-b-transparent border-l-transparent">
                              <Check size={10} strokeWidth={4} className="absolute -top-[2px] right-[-28px] text-white z-10" />
                            </div>
                          )}
                          <h4 className="font-bebas text-2xl text-[#1a1512] mb-1">Deluxe 2 – Twin Bedded</h4>
                          <p className="text-[13px] text-gray-600 font-medium mb-3">Ideal for 2 Adults</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-[#8b0000]">₹{livePrices.deluxe2.toLocaleString()}<span className="text-[12px] font-normal text-gray-500"> / night</span></span>
                            {!available && <span className="bg-[#8b000015] border border-[#8b000040] text-[#8b0000] text-[10px] font-bold px-2 py-1 rounded">Sold Out</span>}
                          </div>
                        </div>
                      );
                    })()}
                    {/* Deluxe 3 */}
                    {(() => {
                      const available = isCategoryAvailable('deluxe3');
                      return (
                        <div 
                          onClick={() => available && setRoomType('deluxe3')} 
                          className={\`relative border rounded-xl p-4 transition-all duration-200 \${roomType === 'deluxe3' ? 'border-[#8b0000] bg-[#8b000008] shadow-sm' : 'border-gray-300 bg-white hover:border-[#8b0000] hover:bg-gray-50'}\`}
                          style={{ opacity: available ? 1 : 0.5, cursor: available ? 'pointer' : 'not-allowed', pointerEvents: available ? 'auto' : 'none' }}
                        >
                          {roomType === 'deluxe3' && (
                            <div className="absolute top-0 right-0 w-0 h-0 border-solid border-t-0 border-r-[30px] border-b-[30px] border-l-0 border-r-[#8b0000] border-b-transparent border-l-transparent">
                              <Check size={10} strokeWidth={4} className="absolute -top-[2px] right-[-28px] text-white z-10" />
                            </div>
                          )}
                          <h4 className="font-bebas text-2xl text-[#1a1512] mb-1">Deluxe 3 – 3 Bedded</h4>
                          <p className="text-[13px] text-gray-600 font-medium mb-3">Ideal for 2 Adults + 1 Child OR 3 Adults</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-[#8b0000]">₹{livePrices.deluxe3.toLocaleString()}<span className="text-[12px] font-normal text-gray-500"> / night</span></span>
                            {!available && <span className="bg-[#8b000015] border border-[#8b000040] text-[#8b0000] text-[10px] font-bold px-2 py-1 rounded">Sold Out</span>}
                          </div>
                        </div>
                      );
                    })()}
                    {/* Deluxe 4 */}
                    {(() => {
                      const available = isCategoryAvailable('deluxe4');
                      return (
                        <div 
                          onClick={() => available && setRoomType('deluxe4')} 
                          className={\`relative border rounded-xl p-4 transition-all duration-200 \${roomType === 'deluxe4' ? 'border-[#8b0000] bg-[#8b000008] shadow-sm' : 'border-gray-300 bg-white hover:border-[#8b0000] hover:bg-gray-50'}\`}
                          style={{ opacity: available ? 1 : 0.5, cursor: available ? 'pointer' : 'not-allowed', pointerEvents: available ? 'auto' : 'none' }}
                        >
                          {roomType === 'deluxe4' && (
                            <div className="absolute top-0 right-0 w-0 h-0 border-solid border-t-0 border-r-[30px] border-b-[30px] border-l-0 border-r-[#8b0000] border-b-transparent border-l-transparent">
                              <Check size={10} strokeWidth={4} className="absolute -top-[2px] right-[-28px] text-white z-10" />
                            </div>
                          )}
                          <h4 className="font-bebas text-2xl text-[#1a1512] mb-1">Deluxe 4 – 4 Bedded</h4>
                          <p className="text-[13px] text-gray-600 font-medium mb-3">Ideal for 3 Adults + 1 Child OR 4 Adults</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-[#8b0000]">₹{livePrices.deluxe4.toLocaleString()}<span className="text-[12px] font-normal text-gray-500"> / night</span></span>
                            {!available && <span className="bg-[#8b000015] border border-[#8b000040] text-[#8b0000] text-[10px] font-bold px-2 py-1 rounded">Sold Out</span>}
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col">
                      <label className="text-[12px] font-bold text-[#8b0000] mb-1.5 uppercase tracking-wide">Change Check-in Date</label>
                      <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="bg-white border-[1.5px] border-gray-300 rounded-lg px-4 py-3 text-[14.5px] font-medium text-gray-900 focus:outline-none focus:border-[#8b0000] focus:ring-4 focus:ring-[#8b000015] transition-all" />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[12px] font-bold text-[#8b0000] mb-1.5 uppercase tracking-wide">Change Check-out Date</label>
                      <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="bg-white border-[1.5px] border-gray-300 rounded-lg px-4 py-3 text-[14.5px] font-medium text-gray-900 focus:outline-none focus:border-[#8b0000] focus:ring-4 focus:ring-[#8b000015] transition-all" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-[12px] font-bold text-[#8b0000] mb-1.5 uppercase tracking-wide">Adults (Above 12 yrs)</label>
                      <select value={adults} onChange={(e) => setAdults(Number(e.target.value))} className="bg-white border-[1.5px] border-gray-300 rounded-lg px-4 py-3 text-[14.5px] font-medium text-gray-900 focus:outline-none focus:border-[#8b0000] focus:ring-4 focus:ring-[#8b000015] transition-all">
                        <option value={1}>1 Adult</option>
                        <option value={2}>2 Adults</option>
                        <option value={3}>3 Adults</option>
                        <option value={4}>4 Adults</option>
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[12px] font-bold text-[#8b0000] mb-1.5 uppercase tracking-wide">Children (0 - 12 yrs)</label>
                      <select value={children} onChange={(e) => setChildren(Number(e.target.value))} className="bg-white border-[1.5px] border-gray-300 rounded-lg px-4 py-3 text-[14.5px] font-medium text-gray-900 focus:outline-none focus:border-[#8b0000] focus:ring-4 focus:ring-[#8b000015] transition-all">
                        <option value={0}>No Children</option>
                        <option value={1}>1 Child</option>
                        <option value={2}>2 Children</option>
                        <option value={3}>3 Children</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Card 3: Guest Contact Details */}
                <div className="bg-white rounded-2xl border border-[#e3e1d9] p-6 md:p-8 shadow-sm hover:border-[#d1cfc5] hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between border-b border-[#f1efe8] pb-4 mb-6">
                    <div className="text-xl font-bold text-[#1a1512] flex items-center gap-3">
                      <Users size={20} className="text-[#8b0000]" />
                      <span>Primary Guest Details</span>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">* Required fields</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-[2fr_5fr_5fr] gap-4 mb-4">
                    <div className="flex flex-col">
                      <label className="text-[12px] font-bold text-[#8b0000] mb-1.5 uppercase tracking-wide">Salutation</label>
                      <select value={guestDetails.title} onChange={(e) => setGuestDetails(prev => ({ ...prev, title: e.target.value }))} className="bg-white border-[1.5px] border-gray-300 rounded-lg px-4 py-3 text-[14.5px] font-medium text-gray-900 focus:outline-none focus:border-[#8b0000] focus:ring-4 focus:ring-[#8b000015] transition-all">
                        <option value="Mr">Mr.</option>
                        <option value="Mrs">Mrs.</option>
                        <option value="Ms">Ms.</option>
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[12px] font-bold text-[#8b0000] mb-1.5 uppercase tracking-wide">First Name *</label>
                      <input type="text" placeholder="e.g. Kalyan" value={guestDetails.firstName} onChange={(e) => setGuestDetails(prev => ({ ...prev, firstName: e.target.value }))} className="bg-white border-[1.5px] border-gray-300 rounded-lg px-4 py-3 text-[14.5px] font-medium text-gray-900 focus:outline-none focus:border-[#8b0000] focus:ring-4 focus:ring-[#8b000015] transition-all" />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[12px] font-bold text-[#8b0000] mb-1.5 uppercase tracking-wide">Last Name *</label>
                      <input type="text" placeholder="e.g. Sharma" value={guestDetails.lastName} onChange={(e) => setGuestDetails(prev => ({ ...prev, lastName: e.target.value }))} className="bg-white border-[1.5px] border-gray-300 rounded-lg px-4 py-3 text-[14.5px] font-medium text-gray-900 focus:outline-none focus:border-[#8b0000] focus:ring-4 focus:ring-[#8b000015] transition-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col relative">
                      <label className="text-[12px] font-bold text-[#8b0000] mb-1.5 uppercase tracking-wide">Email Address *</label>
                      <input type="email" placeholder="email@example.com" value={guestDetails.email} onChange={(e) => setGuestDetails(prev => ({ ...prev, email: e.target.value }))} className="bg-white border-[1.5px] border-gray-300 rounded-lg pl-11 pr-4 py-3 text-[14.5px] font-medium text-gray-900 focus:outline-none focus:border-[#8b0000] focus:ring-4 focus:ring-[#8b000015] transition-all w-full" />
                      <Mail size={18} className="absolute left-4 top-[35px] text-gray-400 pointer-events-none" />
                    </div>
                    <div className="flex flex-col relative">
                      <label className="text-[12px] font-bold text-[#8b0000] mb-1.5 uppercase tracking-wide">Mobile Number *</label>
                      <input type="tel" placeholder="e.g. +91 98765 43210" value={guestDetails.phone} onChange={(e) => setGuestDetails(prev => ({ ...prev, phone: e.target.value }))} className="bg-white border-[1.5px] border-gray-300 rounded-lg pl-11 pr-4 py-3 text-[14.5px] font-medium text-gray-900 focus:outline-none focus:border-[#8b0000] focus:ring-4 focus:ring-[#8b000015] transition-all w-full" />
                      <Phone size={18} className="absolute left-4 top-[35px] text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div className="mt-8">
                    <h4 className="text-[13px] font-bold text-gray-900 mb-1">Special Requests (Optional)</h4>
                    <p className="text-[12px] text-gray-600 mb-3">Select pre-curated options to configure in your premium stay suite.</p>
                    <div className="flex flex-wrap gap-2.5">
                      {requestBadges.map((badge, idx) => (
                        <div 
                          key={idx}
                          onClick={() => handleRequestBadgeToggle(badge)}
                          className={\`px-4 py-2 rounded-full text-[13px] font-semibold cursor-pointer transition-all duration-200 border-[1.5px] flex items-center gap-2 \${specialRequests.includes(badge) ? 'bg-[#8b0000] text-white border-[#8b0000]' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'}\`}
                        >
                          {badge}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* GST Invoice Details */}
                  <div className="mt-8 border-t border-gray-200 pt-6">
                    <label className="flex items-center gap-3 cursor-pointer select-none mb-4 w-fit">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 accent-[#d4af37] cursor-pointer"
                        checked={guestDetails.gstEnabled}
                        onChange={(e) => setGuestDetails(prev => ({ ...prev, gstEnabled: e.target.checked }))}
                      />
                      <span className="text-[13px] font-bold text-gray-900">Enter GST Details (Optional - For corporate invoice claims)</span>
                    </label>

                    {guestDetails.gstEnabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                        <div className="flex flex-col">
                          <label className="text-[12px] font-bold text-[#8b0000] mb-1.5 uppercase tracking-wide">GST Number</label>
                          <input type="text" placeholder="e.g. 07AAAAA1111A1Z1" value={guestDetails.gstNumber} onChange={(e) => setGuestDetails(prev => ({ ...prev, gstNumber: e.target.value }))} className="bg-white border-[1.5px] border-gray-300 rounded-lg px-4 py-3 text-[14.5px] font-medium text-gray-900 focus:outline-none focus:border-[#8b0000] focus:ring-4 focus:ring-[#8b000015] transition-all" />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[12px] font-bold text-[#8b0000] mb-1.5 uppercase tracking-wide">Registered Company Name</label>
                          <input type="text" placeholder="e.g. Braj Heritage Private Ltd." value={guestDetails.gstCompany} onChange={(e) => setGuestDetails(prev => ({ ...prev, gstCompany: e.target.value }))} className="bg-white border-[1.5px] border-gray-300 rounded-lg px-4 py-3 text-[14.5px] font-medium text-gray-900 focus:outline-none focus:border-[#8b0000] focus:ring-4 focus:ring-[#8b000015] transition-all" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card 4: Premium Spiritual Add-ons */}
                <div className="bg-white rounded-2xl border border-[#e3e1d9] p-6 md:p-8 shadow-sm hover:border-[#d1cfc5] hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between border-b border-[#f1efe8] pb-4 mb-6">
                    <div className="text-xl font-bold text-[#1a1512] flex items-center gap-3">
                      <Sparkles size={20} className="text-[#8b0000]" />
                      <span>Enhance Your Spiritual Journey (Add-ons)</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    {/* Addon 1 */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white border border-gray-200 rounded-xl p-5 hover:bg-gray-50 transition-colors gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#8b000015] text-[#8b0000] flex items-center justify-center shrink-0">
                          <Compass size={24} />
                        </div>
                        <div>
                          <h5 className="text-[15px] font-bold text-gray-900 mb-1">Private Vrindavan Temple Darshan Guide</h5>
                          <p className="text-[12px] text-gray-500 m-0 leading-tight">Includes express temple entries, private guide escort, and sacred Prasadam offerings.</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-none border-gray-100 pt-3 sm:pt-0 mt-2 sm:mt-0">
                        <span className="text-[16px] font-extrabold text-[#8b0000]">₹1,500</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={darshanGuide} onChange={(e) => setDarshanGuide(e.target.checked)} />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600 shadow-inner"></div>
                        </label>
                      </div>
                    </div>

                    {/* Addon 2 */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white border border-gray-200 rounded-xl p-5 hover:bg-gray-50 transition-colors gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#8b000015] text-[#8b0000] flex items-center justify-center shrink-0">
                          <Car size={24} />
                        </div>
                        <div>
                          <h5 className="text-[15px] font-bold text-gray-900 mb-1">Chauffeur-Driven Airport Pickup & Drop</h5>
                          <p className="text-[12px] text-gray-500 m-0 leading-tight">Luxury private transfers between New Delhi Airport (DEL) and Braj Nidhi Guesthouse.</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-none border-gray-100 pt-3 sm:pt-0 mt-2 sm:mt-0">
                        <span className="text-[16px] font-extrabold text-[#8b0000]">₹2,500</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={airportCab} onChange={(e) => setAirportCab(e.target.checked)} />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600 shadow-inner"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT SIDEBAR - FARE SUMMARY */}
              <div className="relative">
                <div className="sticky top-[130px] bg-white rounded-2xl border-[1.5px] border-[#d4af3740] p-6 shadow-xl">
                  <div className="flex items-center justify-between border-b-[1.5px] border-[#d4af3730] pb-4 mb-5">
                    <h3 className="text-xl font-bold text-[#8b0000] flex items-center gap-2">
                      <ShieldCheck size={22} />
                      Fare Summary
                    </h3>
                    {apiConnectionStatus === 'live' ? (
                      <span className="bg-[#16a34a15] border border-[#16a34a30] text-[#16a34a] text-[10px] font-bold px-2 py-1 rounded">Live ERP</span>
                    ) : apiConnectionStatus === 'error' ? (
                      <span className="bg-[#8b000010] border border-[#8b000030] text-[#8b0000] text-[10px] font-bold px-2 py-1 rounded">ERP Offline</span>
                    ) : (
                      <span className="bg-gray-100 border border-gray-200 text-gray-600 text-[10px] font-bold px-2 py-1 rounded">Sandbox</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 text-[14px] text-gray-600">
                    <div className="flex justify-between">
                      <span>Base Room Fare ({nights} nights)</span>
                      <span className="font-semibold text-gray-900">₹{roomCost.toLocaleString()}</span>
                    </div>
                    {darshanGuide && (
                      <div className="flex justify-between">
                        <span>Darshan VIP Guide Option</span>
                        <span className="font-semibold text-gray-900">₹1,500</span>
                      </div>
                    )}
                    {airportCab && (
                      <div className="flex justify-between">
                        <span>Airport Luxury Car Pickup</span>
                        <span className="font-semibold text-gray-900">₹2,500</span>
                      </div>
                    )}
                    {isLoggedIn && (
                      <div className="flex justify-between text-green-600 font-bold">
                        <span>10% Club Member Discount</span>
                        <span>-₹{memberDiscount.toLocaleString()}</span>
                      </div>
                    )}
                    {appliedPromo && (
                      <div className="flex justify-between text-green-600 font-bold">
                        <span>Coupon Discount ({appliedPromo})</span>
                        <span>-₹{promoDiscount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="border-t border-gray-100 pt-3 mt-1 flex flex-col gap-3">
                      <div className="flex justify-between">
                        <span>GST (12% Standard Tax)</span>
                        <span className="font-semibold text-gray-900">₹{gstAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Spiritual Trust Levy (5%)</span>
                        <span className="font-semibold text-gray-900">₹{serviceCharge.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="border-t-[1.5px] border-gray-200 pt-4 mt-2 flex justify-between items-center">
                      <span className="text-[20px] font-black text-[#8b0000]">Total Payable</span>
                      <span className="text-[22px] font-black text-[#8b0000]">₹{payableTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Promo Engine */}
                  <div className="mt-6 bg-[#faf9f5] border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-[13px] font-bold text-[#d4af37] mb-2">
                      <Percent size={14} />
                      <span>Apply Promotional Code</span>
                    </div>
                    
                    {appliedPromo ? (
                      <div className="mt-3 bg-[#16a34a10] border border-[#16a34a40] p-3 rounded-lg flex justify-between items-center">
                        <div>
                          <p className="text-[11px] text-[#15803d] font-bold tracking-wide m-0">COUPON APPLIED!</p>
                          <p className="text-[14px] text-gray-900 font-bold m-0">{appliedPromo}</p>
                        </div>
                        <button onClick={handleRemovePromo} className="text-[11px] font-bold text-gray-500 underline hover:text-red-500 transition-colors">Remove</button>
                      </div>
                    ) : (
                      <>
                        <div className="flex gap-2 mt-2">
                          <input type="text" placeholder="ENTER PROMO CODE" value={promoInput} onChange={(e) => setPromoInput(e.target.value)} className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-[13px] font-bold uppercase focus:outline-none focus:border-[#d4af37] transition-colors" />
                          <button onClick={() => handleApplyPromo(promoInput)} className="bg-[#8b000010] border border-[#8b000030] text-[#8b0000] font-bold text-[13px] px-4 py-2 rounded-lg hover:bg-[#8b0000] hover:text-white transition-colors">Apply</button>
                        </div>
                        {promoError && <p className="text-red-400 text-[11px] font-medium mt-1.5">{promoError}</p>}
                        {promoSuccess && <p className="text-green-500 text-[11px] font-medium mt-1.5">{promoSuccess}</p>}

                        <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-gray-200">
                          <div onClick={() => handleApplyPromo('VRINDAVAN10')} className="flex items-center justify-between px-3 py-2 bg-[#8b000008] border border-dashed border-[#8b000030] rounded-lg cursor-pointer hover:bg-[#8b000015] hover:border-[#8b0000] transition-colors group">
                            <span className="text-[12px] font-bold text-[#8b0000] bg-[#8b000015] px-1.5 py-0.5 rounded">VRINDAVAN10</span>
                            <span className="text-[11px] text-gray-500 group-hover:text-gray-800">10% Off Room Suites</span>
                          </div>
                          <div onClick={() => handleApplyPromo('WELCOME500')} className="flex items-center justify-between px-3 py-2 bg-[#8b000008] border border-dashed border-[#8b000030] rounded-lg cursor-pointer hover:bg-[#8b000015] hover:border-[#8b0000] transition-colors group">
                            <span className="text-[12px] font-bold text-[#8b0000] bg-[#8b000015] px-1.5 py-0.5 rounded">WELCOME500</span>
                            <span className="text-[11px] text-gray-500 group-hover:text-gray-800">Save flat ₹500 instantly</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <button onClick={proceedToPayment} className="w-full mt-6 bg-gradient-to-br from-[#d4af37] to-[#8b0000] text-white font-bold text-[16px] py-4 rounded-xl shadow-[0_10px_25px_rgba(212,175,55,0.3)] hover:shadow-[0_15px_30px_rgba(139,0,0,0.35)] hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center gap-2 group">
                    <span>Proceed to Secure Checkout</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="flex items-center justify-center gap-2 mt-5 pt-4 border-t border-gray-100 text-[12px] text-gray-500 font-medium">
                    <Lock size={14} className="text-green-600" />
                    <span>256-bit Secure TLS Booking Shield</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Payment Left Side */}
            <div className="bg-white rounded-2xl border border-[#e3e1d9] shadow-sm p-6 md:p-8">
              {paymentLoading ? (
                <div className="py-10 text-center flex flex-col items-center">
                  <div className="w-14 h-14 border-4 border-[#8b000020] border-t-[#8b0000] rounded-full animate-spin mb-6"></div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{paymentStepText}</h3>
                  <p className="text-[13px] text-gray-500 max-w-xs mx-auto">Please do not close this tab or refresh the page. Your payment is securing.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                    <div className="text-[18px] font-bold text-[#1a1512] flex items-center gap-2">
                      <Lock size={18} className="text-[#8b0000]" />
                      <span>Select Secure Payment Method</span>
                    </div>
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded">Secured by Razorpay</span>
                  </div>

                  <div className="flex flex-col sm:flex-row bg-gray-50 p-1.5 rounded-xl mb-6 gap-1">
                    <button onClick={() => setPaymentMethod('upi')} className={\`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 text-[13px] font-bold transition-all \${paymentMethod === 'upi' ? 'bg-white shadow-sm text-[#8b0000] border border-gray-200' : 'text-gray-500 hover:bg-gray-100'}\`}>
                      <Compass size={16} /> UPI Instants
                    </button>
                    <button onClick={() => setPaymentMethod('qr')} className={\`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 text-[13px] font-bold transition-all \${paymentMethod === 'qr' ? 'bg-white shadow-sm text-[#8b0000] border border-gray-200' : 'text-gray-500 hover:bg-gray-100'}\`}>
                      <QrCode size={16} /> BHIM QR Scan
                    </button>
                    <button onClick={() => setPaymentMethod('card')} className={\`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 text-[13px] font-bold transition-all \${paymentMethod === 'card' ? 'bg-white shadow-sm text-[#8b0000] border border-gray-200' : 'text-gray-500 hover:bg-gray-100'}\`}>
                      <CreditCard size={16} /> Credit Card
                    </button>
                  </div>

                  {/* UPI */}
                  {paymentMethod === 'upi' && (
                    <div className="animate-in fade-in duration-300">
                      <h4 className="text-[15px] font-bold text-gray-900 mb-1">Pay via Instant UPI ID</h4>
                      <p className="text-[12px] text-gray-500 mb-5">Submit your registered Virtual Payment Address (e.g. username@okhdfcbank or phone@paytm).</p>
                      <div className="max-w-[380px] flex flex-col mb-4">
                        <label className="text-[12px] font-bold text-[#8b0000] mb-1.5 uppercase tracking-wide">Enter Virtual Payment Address (VPA)</label>
                        <input type="text" placeholder="e.g. kalyan@ybl" value={upiId} onChange={(e) => setUpiId(e.target.value)} className="bg-white border-[1.5px] border-gray-300 rounded-lg px-4 py-3 text-[14.5px] font-medium focus:outline-none focus:border-[#8b0000] focus:ring-4 focus:ring-[#8b000015] transition-all" />
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-[12px] text-gray-600 flex items-start gap-3 mt-4">
                        <Info size={16} className="text-[#8b0000] shrink-0 mt-0.5" />
                        <span>We will send a secure transaction request directly to your UPI smartphone application. Please approve within 5 minutes.</span>
                      </div>
                    </div>
                  )}

                  {/* QR */}
                  {paymentMethod === 'qr' && (
                    <div className="text-center py-4 animate-in fade-in duration-300">
                      <h4 className="text-[16px] font-bold text-gray-900 mb-1">Scan Unified BHIM Trust QR Code</h4>
                      <p className="text-[12px] text-gray-500 mb-6 max-w-xs mx-auto">Scan this official encrypted dynamic booking receipt QR using any UPI app (GPay, PhonePe, Paytm).</p>
                      <div className="inline-block bg-white p-4 rounded-2xl border-[3px] border-[#d4af37] shadow-[0_0_25px_rgba(212,175,55,0.2)]">
                        <QrCode size={180} className="text-gray-900" />
                      </div>
                      <div className="flex items-center justify-center gap-2 text-[13px] font-bold text-[#84cc16] mt-5">
                        <Clock size={16} />
                        <span>QR Code expires in 4 mins 52 secs</span>
                      </div>
                    </div>
                  )}

                  {/* Card */}
                  {paymentMethod === 'card' && (
                    <div className="animate-in fade-in duration-300">
                      <h4 className="text-[15px] font-bold text-gray-900 mb-1">Pay via Secure Credit or Debit Card</h4>
                      <p className="text-[12px] text-gray-500 mb-5">Enter card details. We encrypt this data directly via end-to-end PCI-DSS compliant secure vaults.</p>
                      <div className="flex flex-col mb-4">
                        <label className="text-[12px] font-bold text-[#8b0000] mb-1.5 uppercase tracking-wide">Cardholder Full Name</label>
                        <input type="text" placeholder="e.g. Kalyan Sharma" className="bg-white border-[1.5px] border-gray-300 rounded-lg px-4 py-3 text-[14.5px] font-medium focus:outline-none focus:border-[#8b0000] focus:ring-4 focus:ring-[#8b000015] transition-all" />
                      </div>
                      <div className="flex flex-col mb-4">
                        <label className="text-[12px] font-bold text-[#8b0000] mb-1.5 uppercase tracking-wide">Debit / Credit Card Number</label>
                        <input type="text" placeholder="4111 2222 3333 4444" maxLength={19} value={cardNo} onChange={(e) => setCardNo(e.target.value)} className="bg-white border-[1.5px] border-gray-300 rounded-lg px-4 py-3 text-[14.5px] font-medium focus:outline-none focus:border-[#8b0000] focus:ring-4 focus:ring-[#8b000015] transition-all" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <label className="text-[12px] font-bold text-[#8b0000] mb-1.5 uppercase tracking-wide">Expiry (MM/YY)</label>
                          <input type="text" placeholder="09/29" maxLength={5} value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} className="bg-white border-[1.5px] border-gray-300 rounded-lg px-4 py-3 text-[14.5px] font-medium focus:outline-none focus:border-[#8b0000] focus:ring-4 focus:ring-[#8b000015] transition-all" />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[12px] font-bold text-[#8b0000] mb-1.5 uppercase tracking-wide">CVV Shield</label>
                          <input type="password" placeholder="***" maxLength={3} value={cardCVV} onChange={(e) => setCardCVV(e.target.value)} className="bg-white border-[1.5px] border-gray-300 rounded-lg px-4 py-3 text-[14.5px] font-medium focus:outline-none focus:border-[#8b0000] focus:ring-4 focus:ring-[#8b000015] transition-all" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 mt-8">
                    <button onClick={() => setCurrentStep(1)} className="flex-1 py-4 bg-transparent border-[1.5px] border-gray-300 text-gray-600 rounded-xl font-bold text-[14px] hover:bg-gray-50 transition-colors">Back</button>
                    <button onClick={triggerPaymentProcessing} className="flex-[2] py-4 bg-gradient-to-br from-[#d4af37] to-[#8b0000] text-white rounded-xl font-bold text-[15px] shadow-[0_8px_20px_rgba(139,0,0,0.25)] hover:shadow-[0_12px_25px_rgba(139,0,0,0.35)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                      <ShieldCheck size={18} /> Pay Securely ₹{payableTotal.toLocaleString()}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Payment Right Side - Summary */}
            <div className="bg-white rounded-2xl border-[1.5px] border-[#d4af3740] p-6 shadow-md h-fit">
              <h3 className="text-[18px] font-bold text-[#8b0000] border-b-[1.5px] border-[#d4af3730] pb-4 mb-4 flex items-center gap-2">
                <Compass size={18} /> Booking Outline
              </h3>
              <div className="text-[13px] text-gray-600 flex flex-col gap-2.5">
                <p className="flex justify-between m-0"><span>Suite:</span><strong className="text-gray-900">{getRoomTitle(roomType)}</strong></p>
                <p className="flex justify-between m-0"><span>Nights Count:</span><strong className="text-gray-900">{nights} {nights === 1 ? 'Night' : 'Nights'}</strong></p>
                <p className="flex justify-between m-0"><span>Guests:</span><strong className="text-gray-900">{adults} Adults, {children} Children</strong></p>
                <p className="flex justify-between m-0"><span>Primary Guest:</span><strong className="text-gray-900">{guestDetails.firstName} {guestDetails.lastName}</strong></p>
              </div>
              <div className="border-t border-gray-100 pt-4 mt-4 flex flex-col gap-2 text-[13px]">
                <div className="flex justify-between text-gray-600"><span>Room Net cost:</span><span>₹{roomCost.toLocaleString()}</span></div>
                {totalDiscount > 0 && <div className="flex justify-between text-green-600 font-bold"><span>Combined Discounts:</span><span>-₹{totalDiscount.toLocaleString()}</span></div>}
                <div className="flex justify-between items-center text-[18px] font-black text-[#8b0000] border-t border-gray-100 pt-3 mt-1">
                  <span>Final Amount:</span><span>₹{payableTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {currentStep === 3 && (
          <div className="max-w-[650px] mx-auto text-center bg-white border border-[#e3e1d9] rounded-3xl p-10 shadow-xl animate-in zoom-in-95 duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#d4af37] to-[#8b0000]"></div>
            <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-500 text-green-500 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
              <CheckCircle2 size={40} strokeWidth={2.5} />
            </div>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-3 inline-block">Booking Confirmed</span>
            <h1 className="font-bebas text-4xl text-[#8b0000] mb-3">Radhe Radhe! Stay Confirmed 🎉</h1>
            <p className="text-gray-600 text-[14px] max-w-md mx-auto mb-8">We are delighted to host you, {guestDetails.firstName}! Your spiritual heritage suite room at Braj Nidhi Guesthouse has been securely booked.</p>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-left mb-8 shadow-sm">
              <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-5">
                <span className="text-[12px] text-gray-500 font-bold uppercase tracking-wider">Booking Reference</span>
                <span className="text-[18px] font-black text-[#d4af37]">{bookingRef}</span>
              </div>
              <div className="grid grid-cols-2 gap-y-5 gap-x-4 text-[13px]">
                <div>
                  <p className="text-gray-500 font-medium mb-1">Suite Category</p>
                  <strong className="text-gray-900">{getRoomTitle(roomType)}</strong>
                </div>
                <div>
                  <p className="text-gray-500 font-medium mb-1">Stay Duration</p>
                  <strong className="text-gray-900">{nights} {nights === 1 ? 'Night' : 'Nights'}</strong>
                </div>
                <div>
                  <p className="text-gray-500 font-medium mb-1">Check-In</p>
                  <strong className="text-gray-900">{new Date(checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} (12:00 PM)</strong>
                </div>
                <div>
                  <p className="text-gray-500 font-medium mb-1">Check-Out</p>
                  <strong className="text-gray-900">{new Date(checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} (11:00 AM)</strong>
                </div>
                <div>
                  <p className="text-gray-500 font-medium mb-1">Primary Guest</p>
                  <strong className="text-gray-900">{guestDetails.title}. {guestDetails.firstName} {guestDetails.lastName}</strong>
                </div>
                <div>
                  <p className="text-gray-500 font-medium mb-1">Amount Paid Securely</p>
                  <strong className="text-green-600 text-[15px]">₹{payableTotal.toLocaleString()}</strong>
                </div>
              </div>
              {specialRequests.length > 0 && (
                <div className="mt-5 border-t border-gray-200 pt-4">
                  <p className="text-[12px] text-gray-500 font-medium mb-2">Configured Suite Add-ons</p>
                  <div className="flex flex-wrap gap-2">
                    {specialRequests.map((r, i) => <span key={i} className="text-[11px] text-[#8b0000] bg-[#8b000008] border border-[#8b000020] px-2.5 py-1 rounded-md font-semibold">{r}</span>)}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="px-6 py-3.5 bg-white border-[1.5px] border-gray-300 text-gray-700 rounded-xl font-bold text-[14px] hover:bg-gray-50 transition-colors flex items-center justify-center text-center">Return to Home</Link>
              <button onClick={() => window.print()} className="px-6 py-3.5 bg-gradient-to-br from-[#d4af37] to-[#8b0000] text-white rounded-xl font-bold text-[14px] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center">Print Booking Receipt</button>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-2 text-[12px] text-gray-500 font-medium">
              <MapPin size={14} className="text-[#8b0000]" />
              <span>Location: Braj Nidhi Raman Reti Road, Vrindavan, Uttar Pradesh - 281121</span>
            </div>
          </div>
        )}
      </main>

      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} onLoginSuccess={handleLoginSuccess} initialIsRegistering={loginModalInitialRegister} />
      <FloatingWidgets />

      {/* Retractable Developer Credentials Drawer (Visible in Dev Mode only) */}
      {isDevMode && (
        <>
          <button className="fixed bottom-6 right-6 z-[999] bg-gradient-to-br from-[#111] to-[#222] text-white border-[1.5px] border-[#d4af3760] rounded-full px-6 py-3 text-[13px] font-bold flex items-center gap-2 shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(212,175,55,0.2)] hover:border-[#d4af37] transition-all duration-300" onClick={() => setCredentialsOpen(true)}>
            <Terminal size={16} className="text-[#d4af37]" />
            <span>Dev API Hub</span>
          </button>

          <div className={\`fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000] transition-opacity duration-300 \${credentialsOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}\`} onClick={() => setCredentialsOpen(false)} />

          <div className={\`fixed top-0 right-0 w-full max-w-[400px] h-full bg-gradient-to-b from-[#16120e] to-[#0d0a08] border-l border-[#d4af3730] shadow-[-10px_0_40px_rgba(0,0,0,0.5)] z-[2001] transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] p-8 flex flex-col text-white \${credentialsOpen ? 'translate-x-0' : 'translate-x-full'}\`}>
            <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
              <h3 className="text-lg font-extrabold text-[#d4af37] flex items-center gap-2 m-0"><Terminal size={20} /> Developer Credentials Hub</h3>
              <button className="text-white/50 hover:bg-white/10 hover:text-white p-1.5 rounded-full transition-colors" onClick={() => setCredentialsOpen(false)}><X size={20} /></button>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
              <label className="text-[11px] uppercase text-white/40 font-bold tracking-wide">System Sync Status</label>
              <div className="flex items-center gap-2.5 mt-2">
                <span className={\`w-2.5 h-2.5 rounded-full \${apiConnectionStatus === 'live' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : apiConnectionStatus === 'error' ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-yellow-500 shadow-[0_0_10px_#eab308]'}\`} />
                <span className={\`text-[14px] font-bold \${apiConnectionStatus === 'live' ? 'text-green-500' : apiConnectionStatus === 'error' ? 'text-red-500' : 'text-yellow-500'}\`}>
                  {apiConnectionStatus === 'live' ? 'Live ERP Active' : apiConnectionStatus === 'error' ? 'Connection Error' : 'Sandbox Simulator Active'}
                </span>
              </div>
              {apiErrorMsg && <p className="text-[11px] text-red-500 mt-3 bg-red-500/10 p-2 rounded-md border border-red-500/20 whitespace-pre-wrap">{apiErrorMsg}</p>}
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-white/60 uppercase tracking-wide">ERP API Base URL</label>
                <input type="text" placeholder="e.g. https://pankaj.vcmerp.in/api/method/..." value={drawerErpBase} onChange={(e) => setDrawerErpBase(e.target.value)} className="bg-white/5 border border-white/10 text-white rounded-lg p-3 text-[13px] outline-none focus:border-[#d4af37] focus:bg-white/10 transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-white/60 uppercase tracking-wide">ERP API Key</label>
                <input type="password" placeholder="Enter api_key" value={drawerApiKey} onChange={(e) => setDrawerApiKey(e.target.value)} className="bg-white/5 border border-white/10 text-white rounded-lg p-3 text-[13px] outline-none focus:border-[#d4af37] focus:bg-white/10 transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-white/60 uppercase tracking-wide">ERP API Secret</label>
                <input type="password" placeholder="Enter api_secret" value={drawerApiSecret} onChange={(e) => setDrawerApiSecret(e.target.value)} className="bg-white/5 border border-white/10 text-white rounded-lg p-3 text-[13px] outline-none focus:border-[#d4af37] focus:bg-white/10 transition-colors" />
              </div>
            </div>

            <p className="text-[11px] text-white/40 mt-5 leading-relaxed">
              💡 These developer credentials are saved securely in your browser's local <code className="text-[#d4af37] font-mono bg-black/20 px-1 py-0.5 rounded">sessionStorage</code>. They will be sent safely through the Next.js API proxy route and are cleared instantly when you close your browser tab.
            </p>

            <button onClick={() => handleSaveCredentials(drawerApiKey, drawerApiSecret, drawerErpBase)} className="w-full py-3.5 bg-gradient-to-br from-[#d4af37] to-[#8b0000] text-white rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 mt-auto hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(139,0,0,0.3)] transition-all">
              <Key size={16} /> Save & Initialize Connection
            </button>
          </div>
        </>
      )}
    </div>
  );
}
`;

fs.writeFileSync(filePath, logicLines + '\n' + newJsx);
console.log("Updated page.tsx successfully!");
