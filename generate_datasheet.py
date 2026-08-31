import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

pdf_path = "/Users/ronaldo/Documents/New Product/assets/duna_hydrosip_datasheet.pdf"
doc = SimpleDocTemplate(
    pdf_path,
    pagesize=letter,
    leftMargin=36,
    rightMargin=36,
    topMargin=36,
    bottomMargin=36
)

styles = getSampleStyleSheet()

# Custom Styles
primary_dark = colors.HexColor("#18181b")
accent_blue = colors.HexColor("#0284c7")
accent_indigo = colors.HexColor("#4f46e5")
sand_bg = colors.HexColor("#f8fafc")
text_muted = colors.HexColor("#64748b")
border_color = colors.HexColor("#e2e8f0")

title_style = ParagraphStyle(
    'DocTitle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=22,
    leading=26,
    textColor=primary_dark
)

subtitle_style = ParagraphStyle(
    'DocSubtitle',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=10,
    leading=14,
    textColor=accent_indigo
)

h2_style = ParagraphStyle(
    'SectionHeader',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=13,
    leading=17,
    textColor=primary_dark,
    spaceBefore=10,
    spaceAfter=6
)

body_style = ParagraphStyle(
    'BodyTextCustom',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8.5,
    leading=12,
    textColor=colors.HexColor("#334155")
)

spec_label = ParagraphStyle(
    'SpecLabel',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=8,
    leading=11,
    textColor=primary_dark
)

spec_val = ParagraphStyle(
    'SpecVal',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8,
    leading=11,
    textColor=colors.HexColor("#334155")
)

story = []

# Header Table with Logo / Brand
header_data = [
    [
        Paragraph("<b>DUNA HYDROSIP™</b><br/><font size=8 color='#64748b'>SPECIFICATION DATA SHEET • REV 2026.4</font>", title_style),
        Paragraph("<b>Duna Innovations Inc.</b><br/><font size=7 color='#64748b'>Certificado ISO 9001 / ANVISA Cat. A<br/>Modelo: DHS-650-N1</font>", subtitle_style)
    ]
]
header_table = Table(header_data, colWidths=[340, 200])
header_table.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('ALIGN', (1,0), (1,0), 'RIGHT'),
]))
story.append(header_table)
story.append(Spacer(1, 8))
story.append(HRFlowable(width="100%", thickness=1.5, color=accent_indigo, spaceBefore=2, spaceAfter=10))

# Product Overview & Schematic Image side-by-side
schematic_img_path = "/Users/ronaldo/Documents/New Product/assets/duna_schematic_vector.jpg"
overview_text = """
<b>Visão Geral do Produto:</b><br/>
A <b>Duna HydroSip™</b> é o primeiro dispositivo portátil de grau de consumo projetado para extração e condensação de água potável mineralizada a partir de areia sílica árida com umidade relativa de 0%.<br/><br/>
Equipada com o processador <b>Neural Duna N1</b> e o modelo <b>AI Burst™ (Powered by Gemini Nano)</b>, a garrafa mapeia micro-canais de evaporação e condensação higroscópica em nanossegundos, abastecendo 650 ml de água pura a 4°C em apenas <b>3 minutos</b> no modo acelerado.
"""

img_flowable = Image(schematic_img_path, width=220, height=130)

top_grid = [
    [Paragraph(overview_text, body_style), img_flowable]
]
top_table = Table(top_grid, colWidths=[310, 230])
top_table.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
    ('BOX', (0,0), (-1,-1), 1, border_color),
    ('PADDING', (0,0), (-1,-1), 8),
]))
story.append(top_table)
story.append(Spacer(1, 10))

# Technical Specifications Table
story.append(Paragraph("1. ESPECIFICAÇÕES TÉCNICAS E FÍSICAS", h2_style))

specs_data = [
    [Paragraph("Capacidade Volumétrica", spec_label), Paragraph("650 ml (22 oz liq.)", spec_val), Paragraph("Tempo de Extração (Normal)", spec_label), Paragraph("18 a 25 minutos", spec_val)],
    [Paragraph("Tempo Extração (AI Burst)", spec_label), Paragraph("<b>3 minutos (Gemini Nano Turbo)</b>", spec_val), Paragraph("Temperatura de Saída", spec_label), Paragraph("4.0°C ± 0.5°C (Resfriamento Peltier)", spec_val)],
    [Paragraph("Peso Líquido", spec_label), Paragraph("380 gramas (sem carga hídrica)", spec_val), Paragraph("Dimensões Físicas", spec_label), Paragraph("240 mm (A) x 74 mm (Ø)", spec_val)],
    [Paragraph("Material do Corpo", spec_label), Paragraph("Titânio Anodizado Grau Aeroespacial 5", spec_val), Paragraph("Cilindro Interno", spec_label), Paragraph("Vidro Borossilicato Duplo Térmico", spec_val)],
    [Paragraph("Pureza da Água (PPM)", spec_label), Paragraph("0.02 PPM (&gt;99.98% pureza química)", spec_val), Paragraph("Taxa de Mineralização", spec_label), Paragraph("72 minerais essenciais (Mg, Zn, Ca)", spec_val)],
    [Paragraph("Alimentação / Bateria", spec_label), Paragraph("Grafeno 4.500 mAh (Autonomia 7 dias)", spec_val), Paragraph("Recarga Auxiliar", spec_label), Paragraph("Solar Fotovoltaica + Indução Qi 15W", spec_val)],
]

specs_table = Table(specs_data, colWidths=[135, 135, 135, 135])
specs_table.setStyle(TableStyle([
    ('GRID', (0,0), (-1,-1), 0.5, border_color),
    ('BACKGROUND', (0,0), (0,-1), colors.HexColor("#f1f5f9")),
    ('BACKGROUND', (2,0), (2,-1), colors.HexColor("#f1f5f9")),
    ('PADDING', (0,0), (-1,-1), 4.5),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
]))
story.append(specs_table)
story.append(Spacer(1, 10))

# AI Burst & Neural Processing Architecture
story.append(Paragraph("2. ARQUITETURA DE INTELIGÊNCIA ARTIFICIAL (AI BURST™)", h2_style))

ai_info = [
    [
        Paragraph("<b>Processador Neural:</b>", spec_label),
        Paragraph("Duna N1 Hexa-Core NPU com 4 TOPS de processamento local sob ultra-baixa tensão.", spec_val)
    ],
    [
        Paragraph("<b>Modelo Integrado:</b>", spec_label),
        Paragraph("Google Gemini Nano (Fine-tuned para termodinâmica molecular e dinâmica de fluídos sílicos).", spec_val)
    ],
    [
        Paragraph("<b>Modulação de Poros:</b>", spec_label),
        Paragraph("Ajuste em tempo real de 12.000 micro-canais magnéticos eletrostáticos que previnem entupimento de poeira.", spec_val)
    ],
    [
        Paragraph("<b>Sensoriamento:</b>", spec_label),
        Paragraph("Matriz de condutividade térmica, índice de refração espectral e higrometria superficial infravermelha.", spec_val)
    ]
]
ai_table = Table(ai_info, colWidths=[120, 420])
ai_table.setStyle(TableStyle([
    ('GRID', (0,0), (-1,-1), 0.5, border_color),
    ('BACKGROUND', (0,0), (0,-1), colors.HexColor("#eef2ff")),
    ('PADDING', (0,0), (-1,-1), 4.5),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
]))
story.append(ai_table)
story.append(Spacer(1, 10))

# Certifications & Warranty
story.append(Paragraph("3. CERTIFICAÇÕES, GARANTIA & CONTEÚDO DA EMBALAGEM", h2_style))

cert_text = """
<b>Itens Inclusos na Embalagem:</b> 1x Garrafa Duna HydroSip (Titânio Fosco 650ml), 1x Base de Carregamento por Indução Magnética USB-C, 1x Cabo Trançado reforçado 1.2m, 3x Cartuchos Minerais Naturais Vulcânicos (1 ano de reposição cada), 1x Manual e Certificado de Garantia.<br/>
<b>Conformidade & Garantia:</b> Certificação IP68 (à prova de areia fina e submersão acidental), BPA Free, FDA Approved Food-grade, Garantia global de 2 anos contra defeitos de fabricação.<br/>
<b>Preço Oficial de Lançamento (Lote 01):</b> R$ 899,00 (Tributos inclusos para o território nacional).
"""
cert_p = Paragraph(cert_text, body_style)
cert_table = Table([[cert_p]], colWidths=[540])
cert_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
    ('BOX', (0,0), (-1,-1), 1, border_color),
    ('PADDING', (0,0), (-1,-1), 7),
]))
story.append(cert_table)

# Footer note
story.append(Spacer(1, 8))
story.append(Paragraph("<font size=7 color='#94a3b8'>© 2026 Duna Innovations Inc. • Documento confidencial de especificações técnicas para pioneiros e parceiros de expedição.</font>", ParagraphStyle('Footer', parent=styles['Normal'], alignment=1)))

doc.build(story)
print("PDF gerado com sucesso!")
