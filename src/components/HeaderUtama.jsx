import React from 'react';

const HeaderUnitama = () => {
  return (
    <div className="w-full border-b border-blue-700 pb-2">
      <div className="flex items-center p-4">
        {/* Logo Kiri - Lebih Besar */}
        <img
          src="/logo-unitama.png"
          alt="Logo UNITAMA"
          className="h-28 w-28 object-contain mr-0 ml-20"
        />

        {/* Teks Center */} 
        <div className="flex-1 text-center">
          <h1 className="text-2xl font-semibold text-blue-600 leading-tight">
            UNIVERSITAS TEKNOLOGI AKBA MAKASSAR
          </h1>
          <h2 className="text-6xl font-bold text-blue-700 tracking-wider mt-1">
            UNITAMA
          </h2>
        </div>

        {/* Spacer Kanan */}
        <div className="w-32" />
      </div>

      {/* Garis Bawah Biru dengan Informasi */}
      <div className="bg-blue-700 text-white text-xs px-4 py-1.5 text-center">
        Alamat: JL. Perintis Kemerdekaan KM 9 NO. 75 Makassar. Telp. 0411-588371 | Email: info@unitama.ac.id | https://unitama.ac.id
      </div>
    </div>
  );
};

export default HeaderUnitama;