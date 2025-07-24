import React from 'react';

const HeaderUnitama = () => {
  return (
    <div className="w-full border-b border-blue-700 pb-2">
      <div className="flex items-center p-4">
        {/* Logo Kiri - Responsive */}
        <img
          src="/logo-unitama.png"
          alt="Logo UNITAMA"
          className="h-16 w-16 md:h-28 md:w-28 object-contain mr-0 ml-2 md:ml-20"
        />

        {/* Teks Center - Responsive */} 
        <div className="flex-1 text-center px-2">
          <h1 className="text-xs sm:text-sm md:text-2xl font-semibold text-blue-600 leading-tight">
            UNIVERSITAS TEKNOLOGI AKBA MAKASSAR
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-6xl font-bold text-blue-700 tracking-wider mt-1">
            UNITAMA
          </h2>
        </div>

        {/* Spacer Kanan - Responsive */}
        <div className="w-4 md:w-32" />
      </div>

      {/* Garis Bawah Biru dengan Informasi - Responsive */}
      <div className="bg-blue-700 text-white text-xs px-2 md:px-4 py-1.5 text-center">
        <div className="hidden md:block">
          Alamat: JL. Perintis Kemerdekaan KM 9 NO. 75 Makassar. Telp. 0411-588371 | Email: info@unitama.ac.id | https://unitama.ac.id
        </div>
        <div className="md:hidden">
          JL. Perintis Kemerdekaan KM 9 NO. 75 Makassar<br />
          Telp. 0411-588371 | info@unitama.ac.id
        </div>
      </div>
    </div>
  );
};

export default HeaderUnitama;