import html2canvas from 'html2canvas';

export class ChartExportService {
  
  /**
   * Eksportuje wykres jako obraz PNG
   */
  async exportChartAsPNG(chartElement: HTMLElement, filename: string = 'chart.png'): Promise<void> {
    try {
      const canvas = await html2canvas(chartElement, {
        backgroundColor: '#ffffff',
        scale: 2, // Wyższa jakość
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      // Konwersja na blob
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
      
    } catch (error) {
      console.error('Błąd podczas eksportu wykresu:', error);
      throw new Error('Nie udało się wyeksportować wykresu');
    }
  }

  /**
   * Eksportuje wykres jako obraz JPEG
   */
  async exportChartAsJPEG(chartElement: HTMLElement, filename: string = 'chart.jpg', quality: number = 0.9): Promise<void> {
    try {
      const canvas = await html2canvas(chartElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, 'image/jpeg', quality);
      
    } catch (error) {
      console.error('Błąd podczas eksportu wykresu JPEG:', error);
      throw new Error('Nie udało się wyeksportować wykresu');
    }
  }

  /**
   * Konwertuje wykres na base64 dla użycia w PDF
   */
  async convertChartToBase64(chartElement: HTMLElement): Promise<string> {
    try {
      const canvas = await html2canvas(chartElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Błąd podczas konwersji wykresu na base64:', error);
      throw new Error('Nie udało się skonwertować wykresu');
    }
  }

  /**
   * Eksportuje wiele wykresów jednocześnie
   */
  async exportMultipleCharts(charts: { element: HTMLElement; filename: string }[]): Promise<void> {
    try {
      const promises = charts.map(chart => 
        this.exportChartAsPNG(chart.element, chart.filename)
      );
      
      await Promise.all(promises);
    } catch (error) {
      console.error('Błąd podczas eksportu wielu wykresów:', error);
      throw new Error('Nie udało się wyeksportować wykresów');
    }
  }

  /**
   * Tworzy miniaturę wykresu
   */
  async createChartThumbnail(chartElement: HTMLElement, maxWidth: number = 200, maxHeight: number = 150): Promise<string> {
    try {
      const canvas = await html2canvas(chartElement, {
        backgroundColor: '#ffffff',
        scale: 1,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      // Tworzenie miniaturki
      const thumbnailCanvas = document.createElement('canvas');
      const ctx = thumbnailCanvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Nie udało się utworzyć kontekstu canvas');
      }
      
      // Obliczanie proporcji
      const ratio = Math.min(maxWidth / canvas.width, maxHeight / canvas.height);
      thumbnailCanvas.width = canvas.width * ratio;
      thumbnailCanvas.height = canvas.height * ratio;
      
      // Rysowanie miniaturki
      ctx.drawImage(canvas, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);
      
      return thumbnailCanvas.toDataURL('image/png');
    } catch (error) {
      console.error('Błąd podczas tworzenia miniaturki:', error);
      throw new Error('Nie udało się utworzyć miniaturki wykresu');
    }
  }
}

// Singleton instance
export const chartExportService = new ChartExportService();
