import React, { useState } from 'react';
import { Search, ShoppingCart, MessageSquare, Clipboard, X } from 'lucide-react';

const CATEGORIES = [
  { id: 'kartvizit', label: 'Kartvizit' },
  { id: 'el-ilani-brosur', label: 'El İlanı / Broşür' },
  { id: 'kuse-cikartma', label: 'Kuşe Çıkartma' },
  { id: 'amerikan-servisi', label: 'Amerikan Servisi' },
  { id: 'antetli-kagit', label: 'Antetli Kağıt' },
  { id: 'bloknot', label: 'Bloknot' },
  { id: 'teklif-dosyasi', label: 'Teklif Dosyası' },
  { id: 'katalog', label: 'Katalog' },
  { id: 'davetiye', label: 'Davetiye' },
  { id: 'imsakiye', label: 'İmsakiye' },
  { id: 'kup-bloknot', label: 'Küp Bloknot' },
  { id: 'zarf', label: 'Zarf' },
  { id: 'otokopili-makbuz', label: 'Otokopili Makbuz' }
];

const PRICE_DATA = {
  kartvizit: [
    { code: 'SKAYT', name: 'Sıvama (Çift Yön Kabartma Lak Tek Yön Varak Altın Yaldız Özel Kesimli)', size: '5 x 8 cm', paper: '300 Gr + 300 Gr / Amerikan Bristol', lamination: 'Mat Selefon', sides: 'Çift Yön', qty: '1000', price: '2.500,00 TL' },
    { code: 'SKAYÇ', name: 'Sıvama (Çift Yön Kabartma Lak Çift Yön Varak Altın Yaldız Özel Kesimli)', size: '5 x 8 cm', paper: '300 Gr + 300 Gr / Amerikan Bristol', lamination: 'Mat Selefon', sides: 'Çift Yön', qty: '1000', price: '2.700,00 TL' },
    { code: 'ŞEFB4K', name: 'Şeffaf Kartvizit (Beyaz+Cmyk+Kabartma Lak)', size: '5 x 8 cm', paper: '400 Micron Asetat', lamination: 'Selefon Yok', sides: 'Tek Yön', qty: '500', price: '3.400,00 TL' },
    { code: 'ŞEFB4', name: 'Şeffaf Kartvizit (Beyaz+Cmyk)', size: '5 x 8 cm', paper: '400 Micron Asetat', lamination: 'Selefon Yok', sides: 'Tek Yön', qty: '500', price: '3.000,00 TL' },
    { code: 'ŞEFN', name: 'Şeffaf Kartvizit (CMYK)', size: '5 x 8 cm', paper: '400 Micron Asetat', lamination: 'Selefon Yok', sides: 'Tek Yön', qty: '500', price: '2.800,00 TL' },
    { code: 'AYD', name: 'Düz Kesim Tek Yön Varak Altın Yaldız', size: '5.2 x 8.2 cm', paper: 'Kuşe / 350 Gr.', lamination: 'Mat Selefon', sides: 'Çift Yön', qty: '1000', price: '1.800,00 TL' },
    { code: 'AYG', name: 'Özel Kesim Tek Yön Altın Yaldız+Gofre', size: '5 x 8 cm', paper: 'Kuşe / 350 Gr.', lamination: 'Mat Selefon', sides: 'Çift Yön', qty: '1000', price: '2.800,00 TL' },
    { code: 'SAYT', name: 'Sıvama (Çift Yön Renkli Baskı Tek Yön Varak Altın Yaldız Özel Kesimli)', size: '5 x 8 cm', paper: '300 Gr + 300 Gr / Amerikan Bristol', lamination: 'Mat Selefon', sides: 'Çift Yön', qty: '1000', price: '2.400,00 TL' },
    { code: 'AYÖ', name: 'Özel Kesimli Tek Yön Varak Altın Yaldız', size: '5 x 8 cm', paper: 'Kuşe / 350 Gr.', lamination: 'Mat Selefon', sides: 'Çift Yön', qty: '1000', price: '2.100,00 TL' },
    { code: 'TFT', name: 'Tek Yön Kartvizit (Renkli) Fantazi tuale', size: '5.2 x 8.2 cm', paper: 'Fantazi Tual / 280 Gr.', lamination: 'Selefon Yok', sides: 'Tek Yön', qty: '1000', price: '1.600,00 TL' },
    { code: 'TFJ', name: 'Tek Yön Kartvizit (Renkli) Fantazi Japon Bristol', size: '5.2 x 8.2 cm', paper: 'Fantazi Japon / 300 Gr.', lamination: 'Selefon Yok', sides: 'Tek Yön', qty: '1000', price: '1.500,00 TL' },
    { code: 'TPK', name: 'Tek Yön Kartvizit (Renkli) Parlak Selefon', size: '5.2 x 8.2 cm', paper: 'A. Bristol / 270 Gr.', lamination: 'Parlak Selefon', sides: 'Tek Yön', qty: '1000', price: '1.000,00 TL' },
    { code: 'ABK', name: 'Tek Yön Kartvizit (Renkli) Arka Tek Renk Siyah Baskılı', size: '5.2 x 8.2 cm', paper: 'A. Bristol / 270 Gr.', lamination: 'Parlak Selefon', sides: 'Tek Yön', qty: '1000', price: '1.000,00 TL' },
    { code: 'TMK', name: 'Tek Yön Kartvizit (Renkli) Mat Selefon', size: '5.2 x 8.2 cm', paper: 'Kuşe / 350 Gr.', lamination: 'Mat Selefon', sides: 'Tek Yön', qty: '1000', price: '1.000,00 TL' },
    { code: 'ÇPK', name: 'Çift Yön Kartvizit (Renkli) Parlak Selefon', size: '5.2 x 8.2 cm', paper: 'Kuşe / 350 Gr.', lamination: 'Parlak Selefon', sides: 'Çift Yön', qty: '1000', price: '1.000,00 TL' },
    { code: 'ÇMK', name: 'Çift Yön Kartvizit (Renkli) Mat Selefon', size: '5.2 x 8.2 cm', paper: 'Kuşe / 350 Gr.', lamination: 'Mat Selefon', sides: 'Çift Yön', qty: '1000', price: '1.000,00 TL' },
    { code: 'ÇFT', name: 'Çift Yön Fantazi Tual', size: '5.2 x 8.2 cm', paper: 'Fantazi Tual / 280 Gr.', lamination: 'Selefon Yok', sides: 'Çift Yön', qty: '1000', price: '1.500,00 TL' },
    { code: 'ÇFJ', name: 'Çift Yön Fantazi Japon Bristol', size: '5.2 x 8.2 cm', paper: 'Fantazi Japon / 300 Gr.', lamination: 'Selefon Yok', sides: 'Çift Yön', qty: '1000', price: '1.500,00 TL' },
    { code: 'SVMO', name: 'Sıvama (Çift Taraf Kabartma Lak - Standart oval kesim)', size: '5 x 8 cm', paper: '300 Gr + 300 Gr / Amerikan Bristol', lamination: 'Mat Selefon', sides: 'Çift Yön', qty: '1000', price: '1.800,00 TL' },
    { code: 'ÇÖM', name: 'Kartvizit (Özel Kesimli - Bıçaklı)', size: '5 x 8 cm', paper: 'Kuşe / 350 Gr.', lamination: 'Mat Selefon', sides: 'Çift Yön', qty: '1000', price: '1.700,00 TL' },
    { code: 'ÖKL', name: 'Kartvizit (Çift Taraf Kabartma - Özel Kesimli)', size: '5 x 8 cm', paper: 'Kuşe / 350 Gr.', lamination: 'Mat Selefon', sides: 'Çift Yön', qty: '1000', price: '1.700,00 TL' },
    { code: 'SVMÖ', name: 'Sıvama (Çift Taraf Kabartma Lak - Özel Kesimli)', size: '5 x 8 cm', paper: '300 Gr + 300 Gr / Amerikan Bristol', lamination: 'Mat Selefon', sides: 'Çift Yön', qty: '1000', price: '1.900,00 TL' },
    { code: 'YAGK', name: 'Yağ Kartı (Arka Tekrenk Siyah Baskılı) 8 x 13.5', size: '8 x 13.5 cm', paper: 'A. Bristol / 270 Gr.', lamination: 'Tek Yön Parlak Selefon', sides: 'Çift Yön', qty: '1000', price: '2.700,00 TL' },
    { code: 'YAGKK', name: 'Yağ Kartı (Arka Tekrenk Siyah Baskılı) 6 x 10', size: '6 x 10 cm', paper: 'A. Bristol / 270 Gr.', lamination: 'Tek Yön Parlak Selefon', sides: 'Çift Yön', qty: '1000', price: '2.500,00 TL' }
  ],
  'el-ilani-brosur': [
    { code: 'BRŞ04', name: 'Renkli Broşür (19 x 20)', size: '19 x 20 cm', paper: 'Kuşe / 150 Gr.', lamination: 'Selefon Yok', sides: 'Kırım Yok', qty: '1000', price: '2.625,00 TL' },
    { code: 'BRŞ05', name: 'Renkli Broşür (19 x 20 - Katlamalı)', size: '19 x 20 cm', paper: 'Kuşe / 150 Gr.', lamination: 'Selefon Yok', sides: 'Kırım Var', qty: '1000', price: '3.175,00 TL' },
    { code: 'BRŞ13', name: 'A4 Broşür (21 x 29.7 - Kırımlı)', size: '21 x 29.7 cm', paper: 'Kuşe / 170 Gr.', lamination: 'Parlak Selefon', sides: 'Kırım Var', qty: '1000', price: '5.300,00 TL' },
    { code: 'BRŞ15', name: 'A4 Broşür (21 x 29.7 - Kırımlı)', size: '21 x 29.7 cm', paper: 'Kuşe / 170 Gr.', lamination: 'Mat Selefon', sides: 'Kırım Var', qty: '1000', price: '5.400,00 TL' },
    { code: 'BRŞ12', name: 'A4 Broşür (21 x 29.7)', size: '21 x 29.7 cm', paper: 'Kuşe / 170 Gr.', lamination: 'Parlak Selefon', sides: 'Kırım Yok', qty: '1000', price: '4.750,00 TL' },
    { code: 'BRŞ14', name: 'A4 Broşür (21 x 29.7)', size: '21 x 29.7 cm', paper: 'Kuşe / 170 Gr.', lamination: 'Mat Selefon', sides: 'Kırım Yok', qty: '1000', price: '4.900,00 TL' },
    { code: 'BRŞ10', name: 'A4 Broşür (21 x 29.7)', size: '21 x 29.7 cm', paper: 'Kuşe / 170 Gr.', lamination: 'Selefon Yok', sides: 'Kırım Yok', qty: '1000', price: '3.900,00 TL' },
    { code: 'BRŞ11', name: 'A4 Broşür (21 x 29.7 - Katlamalı)', size: '21 x 29.7 cm', paper: 'Kuşe / 170 Gr.', lamination: 'Selefon Yok', sides: 'Kırım Var', qty: '1000', price: '4.500,00 TL' },
    { code: 'BRŞ06', name: 'A4 Broşür (20 x 29.5)', size: '20 x 29.5 cm', paper: 'Kuşe / 150 Gr.', lamination: 'Selefon Yok', sides: 'Kırım Yok', qty: '1000', price: '3.500,00 TL' },
    { code: 'BRŞ07', name: 'A4 Broşür (20 x 29.5 - Katlamalı)', size: '20 x 29.5 cm', paper: 'Kuşe / 150 Gr.', lamination: 'Selefon Yok', sides: 'Kırım Var', qty: '1000', price: '3.900,00 TL' },
    { code: 'BRŞ21', name: 'A3 Broşür (29.7 x 42 - Kırımlı)', size: '29.7 x 42 cm', paper: 'Kuşe / 170 Gr.', lamination: 'Mat Selefon', sides: 'Kırım Var', qty: '1000', price: '9.750,00 TL' },
    { code: 'BRŞ20', name: 'A3 Broşür (29.7 x 42)', size: '29.7 x 42 cm', paper: 'Kuşe / 170 Gr.', lamination: 'Mat Selefon', sides: 'Kırım Yok', qty: '1000', price: '9.500,00 TL' },
    { code: 'BRŞ19', name: 'A3 Broşür (29.7 x 42 - Kırımlı)', size: '29.7 x 42 cm', paper: 'Kuşe / 170 Gr.', lamination: 'Parlak Selefon', sides: 'Kırım Var', qty: '1000', price: '10.000,00 TL' },
    { code: 'BRŞ18', name: 'A3 Broşür (29.7 x 42)', size: '29.7 x 42 cm', paper: 'Kuşe / 170 Gr.', lamination: 'Parlak Selefon', sides: 'Kırım Yok', qty: '1000', price: '9.500,00 TL' },
    { code: 'BRŞ17', name: 'A3 Broşür (29.7 x 42 - Katlamalı)', size: '29.7 x 42 cm', paper: 'Kuşe / 170 Gr.', lamination: 'Selefon Yok', sides: 'Kırım Var', qty: '1000', price: '7.700,00 TL' },
    { code: 'BRŞ16', name: 'A3 Broşür (29.7 x 42)', size: '29.7 x 42 cm', paper: 'Kuşe / 170 Gr.', lamination: 'Selefon Yok', sides: 'Kırım Yok', qty: '1000', price: '7.150,00 TL' },
    { code: 'BRŞ09', name: 'A3 Broşür (29.5 x 40 - Katlamalı)', size: '29.5 x 40 cm', paper: 'Kuşe / 150 Gr.', lamination: 'Selefon Yok', sides: 'Kırım Var', qty: '1000', price: '7.150,00 TL' },
    { code: 'BRŞ08', name: 'A3 Broşür (29.5 x 40)', size: '29.5 x 40 cm', paper: 'Kuşe / 150 Gr.', lamination: 'Selefon Yok', sides: 'Kırım Yok', qty: '1000', price: '6.600,00 TL' },
    { code: 'ELTY01', name: 'Tek Yön (Renkli) El İlanı', size: '9.5 x 13.5 cm', paper: 'Kuşe / 115 Gr.', lamination: 'Selefon Yok', sides: 'Kırım Yok', qty: '2000', price: '2.000,00 TL' },
    { code: 'ELTY02', name: 'Tek Yön (Renkli) El İlanı', size: '13.5 x 19.5 cm', paper: 'Kuşe / 115 Gr.', lamination: 'Selefon Yok', sides: 'Kırım Yok', qty: '1000', price: '2.000,00 TL' },
    { code: 'ELTY03', name: 'Tek Yön (Renkli) El İlanı', size: '19.5 x 27 cm', paper: 'Kuşe / 115 Gr.', lamination: 'Selefon Yok', sides: 'Kırım Yok', qty: '1000', price: '2.200,00 TL' },
    { code: 'ELTY04', name: 'Tek Yön (Renkli) El İlanı', size: '27 x 39 cm', paper: 'Kuşe / 115 Gr.', lamination: 'Selefon Yok', sides: 'Kırım Yok', qty: '1000', price: '4.000,00 TL' },
    { code: 'ELÇY01', name: 'Çift Yön (Renkli) El İlanı (9.5 x 13.5)', size: '9.5 x 13.5 cm', paper: 'Kuşe / 115 Gr.', lamination: 'Selefon Yok', sides: 'Kırım Yok', qty: '2000', price: '2.000,00 TL' },
    { code: 'BRŞ01', name: 'Çift Yön (Renkli) El İlanı (10 x 14)', size: '10 x 14 cm', paper: 'Kuşe / 150 Gr.', lamination: 'Selefon Yok', sides: 'Kırım Yok', qty: '2000', price: '2.000,00 TL' },
    { code: 'ELÇY02', name: 'Çift Yön (Renkli) El İlanı (13.5 x 19.5)', size: '13.5 x 19.5 cm', paper: 'Kuşe / 115 Gr.', lamination: 'Selefon Yok', sides: 'Kırım Yok', qty: '1000', price: '2.000,00 TL' },
    { code: 'ELÇY03', name: 'Çift Yön (Renkli) El İlanı (19.5 x 27)', size: '19.5 x 27 cm', paper: 'Kuşe / 115 Gr.', lamination: 'Selefon Yok', sides: 'Kırım Yok', qty: '1000', price: '3.000,00 TL' },
    { code: 'ELÇY04', name: 'Çift Yön (Renkli) El İlanı (27 x 39)', size: '27 x 39 cm', paper: 'Kuşe / 115 Gr.', lamination: 'Selefon Yok', sides: 'Kırım Yok', qty: '1000', price: '5.500,00 TL' },
    { code: 'BRŞ03', name: 'Çift Yön (Renkli) El İlanı (9.5 x 20)', size: '9.5 x 20 cm', paper: 'Kuşe / 150 Gr.', lamination: 'Selefon Yok', sides: 'Kırım Yok', qty: '1000', price: '1.750,00 TL' },
    { code: 'BRŞ02', name: 'Çift Yön (Renkli) El İlanı (14 x 20)', size: '14 x 20 cm', paper: 'Kuşe / 150 Gr.', lamination: 'Selefon Yok', sides: 'Kırım Yok', qty: '1000', price: '2.000,00 TL' }
  ],
  'kuse-cikartma': [
    { code: 'YÖKÇ-20x32', name: 'Kuşe Çıkartma (Yaldızlı ve Özel Kesimli)', size: '20 x 32 cm', paper: 'Kuşe Çıkartma', lamination: 'Parlak Selefon', sides: 'Tek Yön', qty: '1000', price: '15.200,00 TL' },
    { code: 'YÖKÇ-16x20', name: 'Kuşe Çıkartma (Yaldızlı ve Özel Kesimli)', size: '16 x 20 cm', paper: 'Kuşe Çıkartma', lamination: 'Parlak Selefon', sides: 'Tek Yön', qty: '1000', price: '7.600,00 TL' },
    { code: 'YÖKÇ-10x16', name: 'Kuşe Çıkartma (Yaldızlı ve Özel Kesimli)', size: '10 x 16 cm', paper: 'Kuşe Çıkartma', lamination: 'Parlak Selefon', sides: 'Tek Yön', qty: '1000', price: '3.800,00 TL' },
    { code: 'YÖKÇ-8x15', name: 'Kuşe Çıkartma (Yaldızlı ve Özel Kesimli)', size: '8 x 15 cm', paper: 'Kuşe Çıkartma', lamination: 'Parlak Selefon', sides: 'Tek Yön', qty: '1000', price: '2.850,00 TL' },
    { code: 'YÖKÇ-8x10', name: 'Kuşe Çıkartma (Yaldızlı ve Özel Kesimli)', size: '8 x 10 cm', paper: 'Kuşe Çıkartma', lamination: 'Parlak Selefon', sides: 'Tek Yön', qty: '1000', price: '1.900,00 TL' },
    { code: 'YÖKÇ-5x16', name: 'Kuşe Çıkartma (Yaldızlı ve Özel Kesimli)', size: '5 x 16 cm', paper: 'Kuşe Çıkartma', lamination: 'Parlak Selefon', sides: 'Tek Yön', qty: '1000', price: '1.900,00 TL' },
    { code: 'YÖKÇ-5x8', name: 'Kuşe Çıkartma (Yaldızlı ve Özel Kesimli)', size: '5 x 8 cm', paper: 'Kuşe Çıkartma', lamination: 'Parlak Selefon', sides: 'Tek Yön', qty: '1000', price: '950,00 TL' },
    { code: 'ÖKÇ-16x20', name: 'Kuşe Çıkartma (Özel Kesimli)', size: '16 x 20 cm', paper: 'Kuşe Çıkartma', lamination: 'Parlak Selefon', sides: 'Tek Yön', qty: '1000', price: '5.000,00 TL' },
    { code: 'ÖKÇ-20x32', name: 'Kuşe Çıkartma (Özel Kesimli)', size: '20 x 32 cm', paper: 'Kuşe Çıkartma', lamination: 'Parlak Selefon', sides: 'Tek Yön', qty: '1000', price: '10.000,00 TL' },
    { code: 'ÖKÇ-10x16', name: 'Kuşe Çıkartma (Özel Kesimli)', size: '10 x 16 cm', paper: 'Kuşe Çıkartma', lamination: 'Parlak Selefon', sides: 'Tek Yön', qty: '1000', price: '2.500,00 TL' },
    { code: 'ÖKÇ-8x15', name: 'Kuşe Çıkartma (Özel Kesimli)', size: '8 x 15 cm', paper: 'Kuşe Çıkartma', lamination: 'Parlak Selefon', sides: 'Tek Yön', qty: '1000', price: '1.875,00 TL' },
    { code: 'ÖKÇ-8x10', name: 'Kuşe Çıkartma (Özel Kesimli)', size: '8 x 10 cm', paper: 'Kuşe Çıkartma', lamination: 'Parlak Selefon', sides: 'Tek Yön', qty: '1000', price: '1.250,00 TL' },
    { code: 'ÖKÇ-5x16', name: 'Kuşe Çıkartma (Özel Kesimli)', size: '5 x 16 cm', paper: 'Kuşe Çıkartma', lamination: 'Parlak Selefon', sides: 'Tek Yön', qty: '1000', price: '1.250,00 TL' },
    { code: 'ÖKÇ-5x8', name: 'Kuşe Çıkartma (Özel Kesimli)', size: '5 x 8 cm', paper: 'Kuşe Çıkartma', lamination: 'Parlak Selefon', sides: 'Tek Yön', qty: '1000', price: '625,00 TL' },
    { code: 'KÇS-20.8x32.8', name: 'Kuşe Çıkartma', size: '20.8 x 32.8 cm', paper: 'Kuşe Çıkartma', lamination: 'Selefon Yok', sides: 'Tek Yön', qty: '1000', price: '4.480,00 TL' },
    { code: 'KÇS-15.6x16.4', name: 'Kuşe Çıkartma', size: '15.6 x 16.4 cm', paper: 'Kuşe Çıkartma', lamination: 'Selefon Yok', sides: 'Tek Yön', qty: '1000', price: '1.680,00 TL' },
    { code: 'KÇ-15.6x16.4', name: 'Kuşe Çıkartma', size: '15.6 x 16.4 cm', paper: 'Kuşe Çıkartma', lamination: 'Parlak Selefon', sides: 'Tek Yön', qty: '1000', price: '1.890,00 TL' },
    { code: 'KÇS-16.4x20.8', name: 'Kuşe Çıkartma', size: '16.4 x 20.8 cm', paper: 'Kuşe Çıkartma', lamination: 'Selefon Yok', sides: 'Tek Yön', qty: '1000', price: '2.240,00 TL' },
    { code: 'KÇS-10.4x16.4', name: 'Kuşe Çıkartma', size: '10.4 x 16.4 cm', paper: 'Kuşe Çıkartma', lamination: 'Selefon Yok', sides: 'Tek Yön', qty: '1000', price: '1.120,00 TL' },
    { code: 'KÇS-8.2x15.6', name: 'Kuşe Çıkartma', size: '8.2 x 15.6 cm', paper: 'Kuşe Çıkartma', lamination: 'Selefon Yok', sides: 'Tek Yön', qty: '1000', price: '840,00 TL' },
    { code: 'KÇS-8.2x10.4', name: 'Kuşe Çıkartma', size: '8.2 x 10.4 cm', paper: 'Kuşe Çıkartma', lamination: 'Selefon Yok', sides: 'Tek Yön', qty: '1000', price: '560,00 TL' },
    { code: 'KÇS-5.2x16.4', name: 'Kuşe Çıkartma', size: '5.2 x 16.4 cm', paper: 'Kuşe Çıkartma', lamination: 'Selefon Yok', sides: 'Tek Yön', qty: '1000', price: '560,00 TL' },
    { code: 'KÇS-5.2x8.2', name: 'Kuşe Çıkartma', size: '5.2 x 8.2 cm', paper: 'Kuşe Çıkartma', lamination: 'Selefon Yok', sides: 'Tek Yön', qty: '1000', price: '280,00 TL' },
    { code: 'KÇ-16.4x20.8', name: 'Kuşe Çıkartma', size: '16.4 x 20.8 cm', paper: 'Kuşe Çıkartma', lamination: 'Parlak Selefon', sides: 'Tek Yön', qty: '1000', price: '2.520,00 TL' },
    { code: 'KÇ-8.2x15.6', name: 'Kuşe Çıkartma', size: '8.2 x 15.6 cm', paper: 'Kuşe Çıkartma', lamination: 'Parlak Selefon', sides: 'Tek Yön', qty: '1000', price: '945,00 TL' },
    { code: 'KÇ-10.4x16.4', name: 'Kuşe Çıkartma', size: '10.4 x 16.4 cm', paper: 'Kuşe Çıkartma', lamination: 'Parlak Selefon', sides: 'Tek Yön', qty: '1000', price: '1.260,00 TL' },
    { code: 'KÇ-8.2x10.4', name: 'Kuşe Çıkartma', size: '8.2 x 10.4 cm', paper: 'Kuşe Çıkartma', lamination: 'Parlak Selefon', sides: 'Tek Yön', qty: '1000', price: '630,00 TL' },
    { code: 'KÇ-5.2x8.2', name: 'Kuşe Çıkartma', size: '5.2 x 8.2 cm', paper: 'Kuşe Çıkartma', lamination: 'Parlak Selefon', sides: 'Tek Yön', qty: '1000', price: '315,00 TL' },
    { code: 'KÇ-5.2x16.4', name: 'Kuşe Çıkartma', size: '5.2 x 16.4 cm', paper: 'Kuşe Çıkartma', lamination: 'Parlak Selefon', sides: 'Tek Yön', qty: '1000', price: '630,00 TL' }
  ],
  'amerikan-servisi': [
    { code: 'AS03', name: 'Tek Yön Amerikan Servis (30x42)', size: '30 x 42 cm', paper: 'Kuşe / 90 Gr.', lamination: 'Selefon Yok', sides: 'Tek Yön', qty: '1000', price: '3.350,00 TL' },
    { code: 'AS02', name: 'Tek Yön Amerikan Servis (30x42)', size: '30 x 42 cm', paper: '1. Hamur / 80 Gr.', lamination: 'Selefon Yok', sides: 'Tek Yön', qty: '1000', price: '2.400,00 TL' },
    { code: 'AS01', name: 'Tek Yön Amerikan Servis (27x39)', size: '27 x 39 cm', paper: 'Kuşe / 115 Gr.', lamination: 'Selefon Yok', sides: 'Tek Yön', qty: '1000', price: '2.300,00 TL' }
  ],
  'antetli-kagit': [
    { code: 'ANT01', name: 'Tek Yön Antetli Kağıt', size: '21 x 29.7 cm', paper: '1. Hamur / 90 Gr.', lamination: 'Selefon Yok', sides: 'Tek Yön', qty: '1000', price: '1.200,00 TL' }
  ],
  bloknot: [
    { code: 'KTB7', name: 'Kapak Takma Bloknot', size: '19.5 x 27 cm', paper: '1. Hamur / 70 Gr.', lamination: 'İçler Tek Renk', sides: 'Tek Yön', qty: '250', price: '17.350,00 TL' },
    { code: 'KTB8', name: 'Kapak Takma Bloknot', size: '19.5 x 27 cm', paper: '1. Hamur / 70 Gr.', lamination: 'İçler 2 Renk', sides: 'Tek Yön', qty: '250', price: '20.150,00 TL' },
    { code: 'KTB9', name: 'Kapak Takma Bloknot', size: '19.5 x 27 cm', paper: '1. Hamur / 70 Gr.', lamination: 'İçler 4 Renk', sides: 'Tek Yön', qty: '250', price: '20.600,00 TL' },
    { code: 'SB7', name: 'Spiralli Bloknot (19.5 x 27)', size: '19.5 x 27 cm', paper: '1. Hamur / 70 Gr.', lamination: 'İçler Tek Renk', sides: 'Tek Yön', qty: '250', price: '13.850,00 TL' },
    { code: 'SB8', name: 'Spiralli Bloknot (19.5 x 27)', size: '19.5 x 27 cm', paper: '1. Hamur / 70 Gr.', lamination: 'İçler 2 Renk', sides: 'Tek Yön', qty: '250', price: '16.600,00 TL' },
    { code: 'SB9', name: 'Spiralli Bloknot (19.5 x 27)', size: '19.5 x 27 cm', paper: '1. Hamur / 70 Gr.', lamination: 'İçler 4 Renk', sides: 'Tek Yön', qty: '250', price: '17.150,00 TL' },
    { code: 'KTB1', name: 'Kapak Takma Bloknot', size: '9.5 x 13.5 cm', paper: '1. Hamur / 70 Gr.', lamination: 'İçler Tek Renk', sides: 'Tek Yön', qty: '250', price: '11.350,00 TL' },
    { code: 'KTB2', name: 'Kapak Takma Bloknot', size: '9.5 x 13.5 cm', paper: '1. Hamur / 70 Gr.', lamination: 'İçler 2 Renk', sides: 'Tek Yön', qty: '250', price: '12.450,00 TL' },
    { code: 'KTB3', name: 'Kapak Takma Bloknot', size: '9.5 x 13.5 cm', paper: '1. Hamur / 70 Gr.', lamination: 'İçler 4 Renk', sides: 'Tek Yön', qty: '250', price: '12.650,00 TL' },
    { code: 'SB1', name: 'Spiralli Bloknot (9.5 x 13.5)', size: '9.5 x 13.5 cm', paper: '1. Hamur / 70 Gr.', lamination: 'İçler Tek Renk', sides: 'Tek Yön', qty: '250', price: '8.400,00 TL' },
    { code: 'SB2', name: 'Spiralli Bloknot (9.5 x 13.5)', size: '9.5 x 13.5 cm', paper: '1. Hamur / 70 Gr.', lamination: 'İçler 2 Renk', sides: 'Tek Yön', qty: '250', price: '9.500,00 TL' },
    { code: 'SB3', name: 'Spiralli Bloknot (9.5 x 13.5)', size: '9.5 x 13.5 cm', paper: '1. Hamur / 70 Gr.', lamination: 'İçler 4 Renk', sides: 'Tek Yön', qty: '250', price: '9.700,00 TL' },
    { code: 'KTB4', name: 'Kapak Takma Bloknot', size: '13.5 x 19.5 cm', paper: '1. Hamur / 70 Gr.', lamination: 'İçler Tek Renk', sides: 'Tek Yön', qty: '250', price: '13.350,00 TL' },
    { code: 'KTB5', name: 'Kapak Takma Bloknot', size: '13.5 x 19.5 cm', paper: '1. Hamur / 70 Gr.', lamination: 'İçler 2 Renk', sides: 'Tek Yön', qty: '250', price: '15.000,00 TL' },
    { code: 'KTB6', name: 'Kapak Takma Bloknot', size: '13.5 x 19.5 cm', paper: '1. Hamur / 70 Gr.', lamination: 'İçler 4 Renk', sides: 'Tek Yön', qty: '250', price: '15.300,00 TL' },
    { code: 'SB5', name: 'Spiralli Bloknot (13.5 x 19.5)', size: '13.5 x 19.5 cm', paper: '1. Hamur / 70 Gr.', lamination: 'İçler 2 Renk', sides: 'Tek Yön', qty: '250', price: '11.850,00 TL' },
    { code: 'SB6', name: 'Spiralli Bloknot (13.5 x 19.5)', size: '13.5 x 19.5 cm', paper: '1. Hamur / 70 Gr.', lamination: 'İçler 4 Renk', sides: 'Tek Yön', qty: '250', price: '12.150,00 TL' },
    { code: 'BL01', name: 'Bloknot', size: '9.5 x 13.5 cm', paper: '1. Hamur / 70 Gr.', lamination: 'Tek Renk', sides: 'Tek Yön', qty: '250', price: '5.150,00 TL' },
    { code: 'BL02', name: 'Bloknot', size: '9.5 x 13.5 cm', paper: '1. Hamur / 70 Gr.', lamination: 'İki Renk', sides: 'Tek Yön', qty: '250', price: '6.250,00 TL' },
    { code: 'BL03', name: 'Bloknot', size: '9.5 x 13.5 cm', paper: '1. Hamur / 70 Gr.', lamination: 'Dört Renk', sides: 'Tek Yön', qty: '250', price: '6.450,00 TL' },
    { code: 'BL04', name: 'Bloknot', size: '13.5 x 19.5 cm', paper: '1. Hamur / 70 Gr.', lamination: 'Tek Renk', sides: 'Tek Yön', qty: '250', price: '6.750,00 TL' },
    { code: 'BL05', name: 'Bloknot', size: '13.5 x 19.5 cm', paper: '1. Hamur / 70 Gr.', lamination: 'İki Renk', sides: 'Tek Yön', qty: '250', price: '8.400,00 TL' },
    { code: 'BL06', name: 'Bloknot', size: '13.5 x 19.5 cm', paper: '1. Hamur / 70 Gr.', lamination: 'Dört Renk', sides: 'Tek Yön', qty: '250', price: '8.700,00 TL' }
  ],
  'teklif-dosyasi': [
    { code: 'TD-01', name: 'Cepli Sunum Dosyası', size: '22 x 31 cm', paper: '350 Gr. Mat Kuşe', lamination: 'Mat Selefon', sides: 'Tek Yön', qty: '500', price: '3.800 TL' }
  ],
  katalog: [
    { code: 'KT-01', name: 'A4 Ürün Kataloğu', size: 'A4', paper: '170 Gr. İç / 300 Gr. Kapak', lamination: 'Kapakta Selefon', sides: '16 Sayfa + Kapak', qty: '500', price: '8.500 TL' }
  ],
  davetiye: [
    { code: 'DV-01', name: 'Düğün Davetiyesi Özel', size: '10 x 20 cm', paper: 'Dokulu Özel Kağıt', lamination: 'Yaldız Detaylı', sides: 'Tek Yön + Zarf', qty: '500', price: '3.200 TL' }
  ],
  imsakiye: [
    { code: 'IM-01', name: 'Ramazan İmsakiyesi Karton', size: '24 x 34 cm', paper: '250 Gr. Kuşe', lamination: 'Yok', sides: 'Tek Yön', qty: '1000', price: '1.800 TL' }
  ],
  'kup-bloknot': [
    { code: 'DKB04', name: 'Dik Küp Bloknot (Kutu Hazır Bıçak)', size: '8.5 x 12 cm', paper: 'İç 110 gr 1.hamur / Kutu 350 gr Mat Kuşe', lamination: 'Mat veya Parlak', sides: 'Çift Yön', qty: '250', price: '17.650,00 TL' },
    { code: 'DKB05', name: 'Dik Küp Bloknot (Kutu Hazır Bıçak)', size: '8.5 x 12 cm', paper: 'İç 110 gr 1.hamur / Kutu 350 gr Mat Kuşe', lamination: 'Mat veya Parlak', sides: 'Çift Yön', qty: '250', price: '19.850,00 TL' },
    { code: 'DKB06', name: 'Dik Küp Bloknot (Kutu Hazır Bıçak)', size: '8.5 x 12 cm', paper: 'İç 110 gr 1.hamur / Kutu 350 gr Mat Kuşe', lamination: 'Mat veya Parlak', sides: 'Çift Yön', qty: '250', price: '20.250,00 TL' },
    { code: 'DKB03', name: 'Dik Küp Bloknot (Kutu Hazır Bıçak)', size: '8.5 x 12 cm', paper: 'İç 200 gr Mat Kuşe / Kutu 350 gr Mat Kuşe', lamination: 'Mat veya Parlak', sides: 'Çift Yön', qty: '250', price: '20.250,00 TL' },
    { code: 'DKB02', name: 'Dik Küp Bloknot (Kutu Hazır Bıçak)', size: '8.5 x 12 cm', paper: 'İç 200 gr Mat Kuşe / Kutu 350 gr Mat Kuşe', lamination: 'Mat veya Parlak', sides: 'Çift Yön', qty: '250', price: '19.900,00 TL' },
    { code: 'DKB01', name: 'Dik Küp Bloknot (Kutu Hazır Bıçak)', size: '8.5 x 12 cm', paper: 'İç 200 gr Mat Kuşe / Kutu 350 gr Mat Kuşe', lamination: 'Mat veya Parlak', sides: 'Çift Yön', qty: '250', price: '18.250,00 TL' },
    { code: 'KB01', name: 'Küp Bloknot 250 li İç', size: '7.8 x 7.8 cm', paper: 'İç 70 gr 1. Hamur / Kutu 300 gr A. Bristol', lamination: 'Mat veya Parlak', sides: 'Tek Yön', qty: '250', price: '17.000,00 TL' },
    { code: 'KB03', name: 'Küp Bloknot 800 lü İç', size: '7.8 x 7.8 cm', paper: 'İç 70 gr 1. Hamur / Kutu 300 gr A. Bristol', lamination: 'Mat veya Parlak', sides: 'Tek Yön', qty: '250', price: '22.000,00 TL' },
    { code: 'skb-02', name: 'Mukavva Sıvama Küp Blok', size: '9.8 x 9.8 cm', paper: '1. Hamur / 80 Gr.', lamination: 'Mat veya Parlak', sides: 'Tek Yön', qty: '100', price: '13.000,00 TL' },
    { code: 'skb-03', name: 'Mukavva Sıvama Küp Blok', size: '8 x 12 cm', paper: '1. Hamur / 80 Gr.', lamination: 'Mat veya Parlak', sides: 'Tek Yön', qty: '100', price: '12.000,00 TL' }
  ],
  zarf: [
    { code: 'TORBAZF1', name: 'Torba Zarf (İmitasyon Kraft - Baskısız)', size: '17 x 25 cm', paper: 'İmitasyon Kraft / 90 Gr', lamination: 'Penceresiz', sides: 'Tek Yön', qty: '1', price: '1,95 TL' },
    { code: 'TORBAZF2', name: 'Torba Zarf (1.Hamur - Baskısız)', size: '17 x 25 cm', paper: '1. Hamur / 110 Gr.', lamination: 'Penceresiz', sides: 'Tek Yön', qty: '1', price: '2,80 TL' },
    { code: 'TORBAZF3', name: 'Torba Zarf (İmitasyon Kraft - Baskısız)', size: '24 x 32 cm', paper: 'İmitasyon Kraft / 90 Gr', lamination: 'Penceresiz', sides: 'Tek Yön', qty: '1', price: '2,85 TL' },
    { code: 'TORBAZF4', name: 'Torba Zarf (1.Hamur - Baskısız)', size: '24 x 32 cm', paper: '1. Hamur / 110 Gr.', lamination: 'Penceresiz', sides: 'Tek Yön', qty: '1', price: '3,75 TL' },
    { code: 'TORBAZF5', name: 'Torba Zarf (İmitasyon Kraft - Baskısız)', size: '26 x 35 cm', paper: 'İmitasyon Kraft / 90 Gr', lamination: 'Penceresiz', sides: 'Tek Yön', qty: '1', price: '3,60 TL' },
    { code: 'TORBAZF6', name: 'Torba Zarf (1.Hamur - Baskısız)', size: '26 x 35 cm', paper: '1. Hamur / 110 Gr.', lamination: 'Penceresiz', sides: 'Tek Yön', qty: '1', price: '4,35 TL' },
    { code: 'ZFBK', name: 'Buklet Zarf (Baskısız - Penceresiz)', size: '11 x 22 cm', paper: '1. Hamur / 110 Gr.', lamination: 'Penceresiz', sides: 'Tek Yön', qty: '1', price: '0,65 TL' },
    { code: 'ZFD1', name: 'Diplomat Zarf (Baskısız - Penceresiz)', size: '10.5 x 24 cm', paper: '1. Hamur / 110 Gr.', lamination: 'Penceresiz', sides: 'Tek Yön', qty: '1', price: '0,90 TL' },
    { code: 'ZFD2', name: 'Diplomat Zarf (Baskısız - Pencereli)', size: '10.5 x 24 cm', paper: '1. Hamur / 110 Gr.', lamination: 'Pencereli', sides: 'Tek Yön', qty: '1', price: '0,95 TL' },
    { code: 'zfbk2', name: 'Buklet Zarf (Baskısız - Pencereli)', size: '11 x 22 cm', paper: '1. Hamur / 110 Gr.', lamination: 'Pencereli', sides: 'Tek Yön', qty: '1', price: '0,70 TL' },
    { code: 'ZF02', name: 'Diplomat Zarf (Tek Renk Logo Baskılı - Pencereli)', size: '10.5 x 24 cm', paper: '1. Hamur / 110 Gr.', lamination: 'Pencereli', sides: 'Tek Yön', qty: '500', price: '1.600,00 TL' },
    { code: 'ZF04', name: 'Diplomat Zarf (İki Renk Logo Baskılı - Pencereli)', size: '10.5 x 24 cm', paper: '1. Hamur / 110 Gr.', lamination: 'Pencereli', sides: 'Tek Yön', qty: '500', price: '2.700,00 TL' },
    { code: 'ZF06', name: 'Diplomat Zarf (Dört Renk Logo Baskılı - Pencereli)', size: '10.5 x 24 cm', paper: '1. Hamur / 110 Gr.', lamination: 'Pencereli', sides: 'Tek Yön', qty: '500', price: '2.900,00 TL' },
    { code: 'ZF01', name: 'Diplomat Zarf (Tek Renk Logo Baskılı - Penceresiz)', size: '10.5 x 24 cm', paper: '1. Hamur / 110 Gr.', lamination: 'Penceresiz', sides: 'Tek Yön', qty: '500', price: '1.550,00 TL' },
    { code: 'ZF03', name: 'Diplomat Zarf (İki Renk Logo Baskılı - Penceresiz)', size: '10.5 x 24 cm', paper: '1. Hamur / 110 Gr.', lamination: 'Penceresiz', sides: 'Tek Yön', qty: '500', price: '2.650,00 TL' },
    { code: 'ZF05', name: 'Diplomat Zarf (Dört Renk Logo Baskılı - Penceresiz)', size: '10.5 x 24 cm', paper: '1. Hamur / 110 Gr.', lamination: 'Penceresiz', sides: 'Tek Yön', qty: '500', price: '2.850,00 TL' },
    { code: 'ZF14', name: 'Buklet Zarf (Dört Renk Logo Baskılı - Pencereli)', size: '11 x 22 cm', paper: '1. Hamur / 110 Gr.', lamination: 'Pencereli', sides: 'Tek Yön', qty: '500', price: '2.900,00 TL' },
    { code: 'ZF10', name: 'Buklet Zarf (Tek Renk Logo Baskılı - Pencereli)', size: '11 x 22 cm', paper: '1. Hamur / 110 Gr.', lamination: 'Pencereli', sides: 'Tek Yön', qty: '500', price: '1.600,00 TL' },
    { code: 'ZF12', name: 'Buklet Zarf (İki Renk Logo Baskılı - Pencereli)', size: '11 x 22 cm', paper: '1. Hamur / 110 Gr.', lamination: 'Pencereli', sides: 'Tek Yön', qty: '500', price: '2.700,00 TL' },
    { code: 'ZF13', name: 'Buklet Zarf (Dört Renk Logo Baskılı - Penceresiz)', size: '11 x 22 cm', paper: '1. Hamur / 110 Gr.', lamination: 'Penceresiz', sides: 'Tek Yön', qty: '500', price: '2.850,00 TL' },
    { code: 'ZF11', name: 'Buklet Zarf (İki Renk Logo Baskılı - Penceresiz)', size: '11 x 22 cm', paper: '1. Hamur / 110 Gr.', lamination: 'Penceresiz', sides: 'Tek Yön', qty: '500', price: '2.650,00 TL' },
    { code: 'ZF09', name: 'Buklet Zarf (Tek Renk Logo Baskılı - Penceresiz)', size: '11 x 22 cm', paper: '1. Hamur / 110 Gr.', lamination: 'Penceresiz', sides: 'Tek Yön', qty: '500', price: '1.550,00 TL' },
    { code: 'ZF17B', name: 'Torba Zarf (1.Hamur - İki Renk Baskılı)', size: '24 x 32 cm', paper: '1. Hamur / 110 Gr.', lamination: 'Penceresiz', sides: 'Tek Yön', qty: '500', price: '4.100,00 TL' },
    { code: 'ZF17A', name: 'Torba Zarf (1.Hamur - Tek Renk Baskılı)', size: '24 x 32 cm', paper: '1. Hamur / 110 Gr.', lamination: 'Penceresiz', sides: 'Tek Yön', qty: '500', price: '2.950,00 TL' },
    { code: 'ZF17C', name: 'Torba Zarf (1.Hamur - Dört Renk Baskılı)', size: '24 x 32 cm', paper: '1. Hamur / 110 Gr.', lamination: 'Penceresiz', sides: 'Tek Yön', qty: '500', price: '4.250,00 TL' },
    { code: 'DZRF', name: 'Davetiye Zarfı (1.Hamur - Baskısız)', size: '12 x 18 cm', paper: '1. Hamur / 70 Gr.', lamination: 'Penceresiz', sides: 'Tek Yön', qty: '1', price: '0,85 TL' }
  ],
  'otokopili-makbuz': [
    { code: 'OM01', name: 'Otokopili Makbuz 1', size: '10 x 14 cm', paper: '54 Gr.', lamination: '2 Nüsha - Numaratörsüz', sides: 'Tek Yön', qty: '10 Cilt', price: '3.000,00 TL' },
    { code: 'OM02', name: 'Otokopili Makbuz 2', size: '10 x 14 cm', paper: '54 Gr.', lamination: '3 Nüsha - Numaratörsüz', sides: 'Tek Yön', qty: '10 Cilt', price: '3.150,00 TL' },
    { code: 'OM05', name: 'Otokopili Makbuz 3', size: '9.3 x 20 cm', paper: '54 Gr.', lamination: '2 Nüsha - Numaratörsüz', sides: 'Tek Yön', qty: '30 Cilt', price: '3.900,00 TL' },
    { code: 'OM06', name: 'Otokopili Makbuz 4', size: '9.3 x 20 cm', paper: '54 Gr.', lamination: '3 Nüsha - Numaratörsüz', sides: 'Tek Yön', qty: '30 Cilt', price: '4.500,00 TL' },
    { code: 'OM09', name: 'Otokopili Makbuz 5', size: '14 x 20 cm', paper: '54 Gr.', lamination: '2 Nüsha - Numaratörsüz', sides: 'Tek Yön', qty: '10 Cilt', price: '3.250,00 TL' },
    { code: 'OM10', name: 'Otokopili Makbuz 6', size: '14 x 20 cm', paper: '54 Gr.', lamination: '3 Nüsha - Numaratörsüz', sides: 'Tek Yön', qty: '10 Cilt', price: '3.450,00 TL' },
    { code: 'OM13', name: 'Otokopili Makbuz 7', size: '20 x 28 cm', paper: '54 Gr.', lamination: '2 Nüsha - Numaratörsüz', sides: 'Tek Yön', qty: '5 Cilt', price: '3.600,00 TL' },
    { code: 'OM14', name: 'Otokopili Makbuz 8', size: '20 x 28 cm', paper: '54 Gr.', lamination: '3 Nüsha - Numaratörsüz', sides: 'Tek Yön', qty: '5 Cilt', price: '4.200,00 TL' },
    { code: 'OMN01', name: 'Otokopili Makbuz 9', size: '10 x 14 cm', paper: '54 Gr.', lamination: '2 Nüsha - Numaratörlü', sides: 'Tek Yön', qty: '10 Cilt', price: '3.300,00 TL' },
    { code: 'OMN02', name: 'Otokopili Makbuz 10', size: '10 x 14 cm', paper: '54 Gr.', lamination: '3 Nüsha - Numaratörlü', sides: 'Tek Yön', qty: '10 Cilt', price: '3.475,00 TL' },
    { code: 'OMN05', name: 'Otokopili Makbuz 11', size: '9.3 x 20 cm', paper: '54 Gr.', lamination: '2 Nüsha - Numaratörlü', sides: 'Tek Yön', qty: '30 Cilt', price: '4.300,00 TL' },
    { code: 'OMN06', name: 'Otokopili Makbuz 12', size: '9.3 x 20 cm', paper: '54 Gr.', lamination: '3 Nüsha - Numaratörlü', sides: 'Tek Yön', qty: '30 Cilt', price: '4.950,00 TL' },
    { code: 'OMN09', name: 'Otokopili Makbuz 13', size: '14 x 20 cm', paper: '54 Gr.', lamination: '2 Nüsha - Numaratörlü', sides: 'Tek Yön', qty: '10 Cilt', price: '3.600,00 TL' },
    { code: 'OMN10', name: 'Otokopili Makbuz 14', size: '14 x 20 cm', paper: '54 Gr.', lamination: '3 Nüsha - Numaratörlü', sides: 'Tek Yön', qty: '10 Cilt', price: '3.800,00 TL' },
    { code: 'OMN13', name: 'Otokopili Makbuz 15', size: '20 x 28 cm', paper: '54 Gr.', lamination: '2 Nüsha - Numaratörlü', sides: 'Tek Yön', qty: '5 Cilt', price: '4.000,00 TL' }
  ]
};

export default function PriceList({ setActiveTab, setPrefilledSpecs }) {
  const [activeCategoryId, setActiveCategoryId] = useState('kartvizit');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filter items in the current active category based on search query
  const getFilteredItems = () => {
    const items = PRICE_DATA[activeCategoryId] || [];
    return items.filter(item => {
      const query = searchQuery.toLowerCase();
      return (
        item.code.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        item.paper.toLowerCase().includes(query)
      );
    });
  };

  const filteredItems = getFilteredItems();

  const handleOrderClick = (product) => {
    setSelectedProduct(product);
  };

  const handleWhatsAppOrder = () => {
    if (!selectedProduct) return;
    const message = `Merhaba Çamdibi Matbaacılık! Web sitenizden sipariş talebi oluşturmak istiyorum:\n\n📦 *Ürün:* [${selectedProduct.code}] ${selectedProduct.name}\n📏 *Ebat:* ${selectedProduct.size}\n📄 *Kağıt/Gr:* ${selectedProduct.paper}\n✨ *Bitiş/Selefon:* ${selectedProduct.lamination}\n🔢 *Adet:* ${selectedProduct.qty} adet\n💰 *Fiyat:* ${selectedProduct.price} + KDV\n\nSiparişimi işleme alabilir misiniz?`;
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/905343747832?text=${encoded}`;
    window.open(url, '_blank');
    setSelectedProduct(null);
  };

  const handleOnlineOrder = () => {
    if (!selectedProduct) return;
    
    // Parse price string to number
    const numericPrice = parseFloat(selectedProduct.price.replace(/[^\d]/g, '')) / (selectedProduct.price.includes(',') ? 100 : 1);
    
    // Map selected product keys directly to OrderCalculator state structure
    const activeLabel = CATEGORIES.find(c => c.id === activeCategoryId)?.label || 'Kartvizit';
    setPrefilledSpecs({
      productName: activeLabel,
      paper: selectedProduct.paper,
      lamination: selectedProduct.lamination,
      size: selectedProduct.size,
      quantity: parseInt(selectedProduct.qty) || 1000,
      basePrice: numericPrice || 500
    });
    setActiveTab('new-order');
    setSelectedProduct(null);
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-1px', marginBottom: '8px', color: '#0f172a' }}>Online Fiyat Listesi & Sipariş Paneli</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '640px', marginInline: 'auto' }}>
          İhtiyacınız olan ürün grubunu seçin, güncel ebat ve fiyat listelerimizi inceleyin. Dilediğiniz ürünü tek tıkla bize WhatsApp üzerinden sipariş geçin veya online sipariş paneli üzerinden dosyanızı yükleyerek hemen sevk edin.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }} className="calc-layout">
        
        {/* Left sidebar - Categories list */}
        <div style={{ width: '260px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '16px', flexShrink: 0 }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', paddingLeft: '8px' }}>Ürün Kategorileri</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => { setActiveCategoryId(cat.id); setSearchQuery(''); }}
                style={{
                  textAlign: 'left',
                  padding: '11px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeCategoryId === cat.id ? '#000000' : 'transparent',
                  color: activeCategoryId === cat.id ? '#ffffff' : 'var(--text-sidebar)',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right content - Price Table grid */}
        <div style={{ flexGrow: 1 }}>
          
          {/* Header toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '16px', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
              {CATEGORIES.find(c => c.id === activeCategoryId)?.label} Listesi
            </h3>
            
            {/* Table Search bar */}
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0 12px', width: '280px', backgroundColor: 'var(--bg-card)' }}>
              <Search size={16} className="text-muted" style={{ marginRight: '8px' }} />
              <input 
                type="text" 
                placeholder="Ürün veya kağıt ara..." 
                style={{ border: 'none', outline: 'none', background: 'transparent', padding: '10px 0', fontSize: '13px', color: 'var(--text-main)', width: '100%' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Price list Table */}
          <div className="section-card">
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>KOD</th>
                    <th>ÜRÜN ADI</th>
                    <th style={{ width: '90px' }}>EBAT</th>
                    <th>KAĞIT / GR.</th>
                    <th style={{ width: '110px' }}>SELEFON</th>
                    <th style={{ width: '70px' }}>ADET</th>
                    <th style={{ width: '110px' }}>FİYAT</th>
                    <th style={{ width: '100px', textAlign: 'center' }}>Sipariş</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item, index) => (
                    <tr key={index}>
                      <td style={{ fontWeight: '700' }}>{item.code}</td>
                      <td style={{ fontSize: '13px', fontWeight: '600', lineHeight: '1.4' }}>{item.name}</td>
                      <td style={{ fontSize: '12px' }}>{item.size}</td>
                      <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.paper}</td>
                      <td style={{ fontSize: '12px' }}>{item.lamination}</td>
                      <td style={{ fontWeight: '700' }}>{item.qty}</td>
                      <td style={{ fontWeight: '800', color: '#000000', fontSize: '14px', whiteSpace: 'nowrap' }}>
                        {item.price} <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', fontWeight: '500', marginTop: '-2px' }}>+KDV</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button 
                          className="btn btn-primary" 
                          style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '12px', display: 'inline-flex', gap: '4px', background: '#000000', color: '#ffffff' }}
                          onClick={() => handleOrderClick(item)}
                        >
                          <ShoppingCart size={13} /> Sipariş
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        Aradığınız kriterlere uygun ürün bulunamadı.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* Choice Modal (WhatsApp vs Online Order panel) */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '16px', fontWeight: '800' }}>Sipariş Yöntemi Seçin</h3>
              <button className="close-btn" onClick={() => setSelectedProduct(null)}><X size={18} /></button>
            </div>
            
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '8px' }}>
                <strong>Seçilen Ürün:</strong> {selectedProduct.name} ({selectedProduct.qty} adet) - <strong>{selectedProduct.price} + KDV</strong>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button 
                  className="btn" 
                  onClick={handleWhatsAppOrder}
                  style={{
                    backgroundColor: '#25D366',
                    color: '#ffffff',
                    padding: '14px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontWeight: '700',
                    fontSize: '14px'
                  }}
                >
                  <MessageSquare size={18} /> WhatsApp ile Sipariş Ver
                </button>
                
                <button 
                  className="btn btn-primary" 
                  onClick={handleOnlineOrder}
                  style={{
                    padding: '14px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontWeight: '700',
                    fontSize: '14px'
                  }}
                >
                  <Clipboard size={18} /> Online Panelden Devam Et
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
