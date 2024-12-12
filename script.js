// 获取DOM元素
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const previewContainer = document.getElementById('previewContainer');
const originalImage = document.getElementById('originalImage');
const compressedImage = document.getElementById('compressedImage');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const quality = document.getElementById('quality');
const qualityValue = document.getElementById('qualityValue');
const downloadBtn = document.getElementById('downloadBtn');

// 当前处理的图片文件
let currentFile = null;

// 初始化事件监听
function initializeEvents() {
    // 点击上传区域触发文件选择
    dropZone.addEventListener('click', () => fileInput.click());
    
    // 文件选择变化处理
    fileInput.addEventListener('change', handleFileSelect);
    
    // 拖拽事件处理
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#0071e3';
    });
    
    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#c7c7c7';
    });
    
    dropZone.addEventListener('drop', handleDrop);
    
    // 质量滑块变化处理
    quality.addEventListener('input', (e) => {
        qualityValue.textContent = `${e.target.value}%`;
        if (currentFile) {
            compressImage(currentFile);
        }
    });
    
    // 下载按钮点击处理
    downloadBtn.addEventListener('click', downloadCompressedImage);
}

// 处理文件选择
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file && isValidImageFile(file)) {
        processImage(file);
    }
}

// 处理拖放
function handleDrop(e) {
    e.preventDefault();
    dropZone.style.borderColor = '#c7c7c7';
    
    const file = e.dataTransfer.files[0];
    if (file && isValidImageFile(file)) {
        processImage(file);
    }
}

// 验证图片文件类型
function isValidImageFile(file) {
    return file.type.match(/^image\/(jpeg|png)$/);
}

// 处理图片
function processImage(file) {
    currentFile = file;
    previewContainer.style.display = 'block';
    
    // 显示原图
    const reader = new FileReader();
    reader.onload = (e) => {
        originalImage.src = e.target.result;
        originalSize.textContent = formatFileSize(file.size);
        compressImage(file);
    };
    reader.readAsDataURL(file);
}

// 压缩图片
function compressImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = img.width;
            canvas.height = img.height;
            
            ctx.drawImage(img, 0, 0);
            
            canvas.toBlob(
                (blob) => {
                    compressedImage.src = URL.createObjectURL(blob);
                    compressedSize.textContent = formatFileSize(blob.size);
                },
                'image/jpeg',
                quality.value / 100
            );
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// 下载压缩后的图片
function downloadCompressedImage() {
    const link = document.createElement('a');
    link.download = `compressed_${currentFile.name}`;
    link.href = compressedImage.src;
    link.click();
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 初始化应用
initializeEvents(); 