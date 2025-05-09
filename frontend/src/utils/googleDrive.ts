export const getGoogleDriveImageUrl = (url: string): string => {
    if (!url) return "/placeholder.jpg"; // 🔹 Si no hay URL, muestra un placeholder
  
    let fileId = "";
  
    // Detectar diferentes formatos de URL de Google Drive
    if (url.includes("/d/")) {
      fileId = url.split("/d/")[1]?.split("/")[0];
    } else if (url.includes("id=")) {
      fileId = url.split("id=")[1]?.split("&")[0];
    }
  
    return fileId
      ? `https://lh3.googleusercontent.com/d/${fileId}=s220`
      : "https://definicion.de/wp-content/uploads/2019/07/perfil-de-usuario.png";
  };
  