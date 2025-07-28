function DownloadButton({ selectedId, pro, date, features, mass }) {
    const feats = features.join("--");
    //console.log("Initializing DownloadButton with:", { selectedId, pro, date, feats, mass });

    const handleDownload = async () => {
        try {
            console.log("Sending download request with:", { selectedId, pro, date, feats, mass });
            const response = await fetch(`${import.meta.env.VITE_API}/api/download_csv/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: selectedId,
                    features: feats,
                    pro: pro,
                    date: date
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const blob = await response.blob(); // binary large object
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href= url;
            a.download = `${selectedId}-${mass.toFixed(2)}.csv`; 
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