function DownloadButton({ selectedId, features, mass }) {
    const feats = features.join("-");
    const handleDownload = async () => {
        try {
            const response = await fetch(`https://rebound-results-api.onrender.com/api/download_csv/${selectedId}/${feats}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const blob = await response.blob(); // binary large object
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href= url;
            a.download = `${selectedId}-${mass}.csv`; 
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url); // Clean up the URL object
        } catch (error) {
            console.error("Error downloading CSV:", error);
        }
        
    };

    

    return (
        <button className="downloadButton"
                onClick={handleDownload}>
            Download CSV
        </button>
    );
}

export default DownloadButton;