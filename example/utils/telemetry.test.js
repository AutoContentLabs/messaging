// Çevresel Değişkenler ve Konfigürasyon Ayarları
process.env.ZIPKIN_HOST_ADDRESS = "localhost";
process.env.ZIPKIN_HOST_PORT = "3000";
process.env.JAEGER_HOST_ADDRESS = "localhost";
process.env.JAEGER_HTTP_PORT = "3000";

// Zipkin ve Jaeger için Exporter Konfigürasyonu
const exporterConfig = {
    zipkin: {
        url: `http://${process.env.ZIPKIN_HOST_ADDRESS}:${process.env.ZIPKIN_HOST_PORT}/api/v2/spans`,
    },
    jaeger: {
        endpoint: `http://${process.env.JAEGER_HOST_ADDRESS}:${process.env.JAEGER_HTTP_PORT}/api/traces`,
    }
};

// Servis Adı Dinamik Olarak Oluşturuluyor
const serviceName = `${process.env.GROUP_ID}-${process.env.MESSAGE_SYSTEM}`;

// Telemetry Sınıfını Başlatma
const { Telemetry, helper } = require("@auto-content-labs/messaging-utils");
const telemetry = new Telemetry(serviceName, exporterConfig);

// Test Etkinliği ve Model Verisi
const eventName = "test";
const id = helper.generateId(8); // Span ID için benzersiz bir kimlik oluşturuluyor
const model = {
    id: "test-1",
    source: "test",
    params: { url: "example.com" },
    priority: "high",
    timestamp: new Date().toISOString() // Zaman damgası
};

// Pair Fonksiyonu: Etkinlik ve Model Bilgilerini Hazırlama
function createPair(eventName, id, model) {
    return {
        event: eventName,
        key: { recordId: id },
        value: model,
        headers: helper.generateHeaders("example")
    };
}

// Span Başlatma
const spanName = "test-span";

// Test Span'ını Başlatıyoruz
const span = telemetry.start(spanName, eventName, createPair(eventName, id, model));

// Başlangıçta Span'ın Kaydedilip Kaydedilmediğini Kontrol Etme
console.log("Span Başlatıldı, isRecording Durumu:", span.isRecording()); // true olmalı

// Span Sonlandırma (End)
span.end(); // Span sonlandırılır

// Bitiş Zamanı ve Süre Hesaplama
// startTime ve endTime dizisini milisaniyeye çevirerek fark hesaplanıyor
const startTimeMs = span.startTime[0] * 1000 + span.startTime[1] / 1000000; // Start time in ms
const endTimeMs = span.endTime[0] * 1000 + span.endTime[1] / 1000000; // End time in ms
const duration = endTimeMs - startTimeMs; // Süre farkı milisaniye cinsinden

console.log("Span Bitiş Zamanı:", endTimeMs);
console.log("Span Başlangıç Zamanı:", startTimeMs);
console.log("Span Süresi (ms):", duration); // Span süresi milisaniye cinsinden

// Span Sonlandırıldığında Durumu Tekrar Kontrol Etme
console.log("Span Sonlandırıldı, isRecording Durumu:", span.isRecording()); // false olmalı
