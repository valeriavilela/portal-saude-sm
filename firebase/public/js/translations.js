// ─────────────────────────────────────────────────────────────
//  js/translations.js  —  PT · EN · ES
//  Cobre: index, agendar, meus-agendamentos, postos-de-saude,
//         loginadmin, admin, cadastrar-ubs
// ─────────────────────────────────────────────────────────────

const translations = {

  // ══════════════════════════════════════════════════════════
  //  PORTUGUÊS
  // ══════════════════════════════════════════════════════════
  pt: {

    /* ── GLOBAL ── */
    gov:                    "Governo do Distrito Federal",
    gov_secao:              "Governo do Distrito Federal — Secretaria de Saúde",
    gov_admin:              "Governo do Distrito Federal — Painel Administrativo",
    admin_login:            "Login Admin",
    back_to_portal:         "Voltar ao Portal",
    main_title:             "Sistema de Agendamento de Consultas — UBS",
    main_title_sm:          "Sistema de Agendamento de Consultas — UBS SANTA MARIA",
    subtitle:               "Secretaria de Saúde do Distrito Federal · Região Administrativa de Santa Maria",
    footer_title:           "Secretaria de Saúde do Distrito Federal",
    footer_text:            "· Sistema de Agendamento de Consultas UBS",
    footer_contact:         "Central de Atendimento: 156 · Ouvidoria: 0800-644-0156",
    footer_rights:          "© 2026 GDF — Todos os direitos reservados",

    /* ── NAVBAR ── */
    home:                   "Início",
    schedule:               "Fazer Agendamento",
    my_appointments:        "Meus Agendamentos",
    health_centers:         "Postos de Saúde",
    admin_panel:            "Painel Admin",
    register_ubs:           "Cadastrar UBS",

    /* ── INDEX ── */
    hero_title:             "Agendamento Online de Consultas",
    hero_desc:              "Agende sua consulta nas Unidades Básicas de Saúde de Santa Maria – DF sem sair de casa. Escolha a UBS, o dia e o horário disponível de forma simples e rápida.",
    schedule_consultation:  "Agendar Consulta",
    schedule_desc:          "Escolha a UBS, data e horário disponível",
    appointments_desc:      "Consulte e cancele agendamentos ativos",
    health_desc:            "Endereços e horários das UBS",
    important_notice:       "O agendamento é pessoal e intransferível. Compareça com RG, CPF e cartão do SUS na data marcada. Cancelamentos devem ser realizados com pelo menos 24 horas de antecedência.",
    how_title:              "Como funciona o agendamento",
    step1_title:            "Selecione o Posto de Saúde",
    step1_desc:             "Escolha a UBS de sua preferência em Santa Maria – DF.",
    step2_title:            "Escolha data e horário disponível",
    step2_desc:             "Visualize os horários livres no calendário e selecione o mais conveniente.",
    step3_title:            "Informe seus dados pessoais",
    step3_desc:             "Preencha nome e CPF para confirmar.",
    step4_title:            "Receba o comprovante",
    step4_desc:             "Um PDF é gerado para confirmação do agendamento.",

    /* ── AGENDAR ── */
    agendar_breadcrumb:     "Fazer Agendamento",
    agendar_card_title:     "Fazer Agendamento",
    select_ubs:             "Selecione a UBS",
    select_date:            "Selecione a Data",
    select_time:            "Selecione o Horário",
    time_placeholder:       "Selecione a UBS e a data primeiro",
    label_nome:             "Nome completo",
    nome_placeholder:       "Seu nome completo",
    label_cpf:              "CPF",
    cpf_placeholder:        "000.000.000-00",
    label_especialidade:    "Especialidade",
    select_placeholder:     "Selecione...",
    btn_confirm:            "Confirmar agendamento",
    cal_sun:                "Dom",
    cal_mon:                "Seg",
    cal_tue:                "Ter",
    cal_wed:                "Qua",
    cal_thu:                "Qui",
    cal_fri:                "Sex",
    cal_sat:                "Sáb",
    success_title:          "Agendamento realizado com sucesso!",
    success_sub:            "Seu agendamento foi confirmado. Baixe o comprovante abaixo para guardar os detalhes.",
    btn_pdf:                "⬇ Baixar Comprovante em PDF",
    btn_new_appt:           "Fazer outro agendamento",
    required_fields:        "Todos os campos obrigatórios (*) devem ser preenchidos.",

    /* ── MEUS AGENDAMENTOS ── */
    meus_breadcrumb:        "Meus Agendamentos",
    consult_title:          "Consultar Agendamentos",
    consult_desc:           "Digite seu CPF para visualizar seus agendamentos cadastrados neste sistema.",
    label_cpf_busca:        "CPF",
    btn_search:             "Buscar",
    appt_results_title:     "Meus Agendamentos",
    appt_empty:             "Digite seu CPF acima para ver seus agendamentos.",

    /* ── POSTOS DE SAÚDE ── */
    postos_breadcrumb:      "Postos de Saúde",
    postos_card_title:      "Unidades Básicas de Saúde — Santa Maria – DF",

    /* ── LOGIN ADMIN ── */
    login_breadcrumb:       "Login Admin",
    login_card_title:       "Acesso Administrativo",
    login_notice:           "Área restrita. Acesso somente para administradores autorizados.",
    label_email:            "E-mail",
    label_senha:            "Senha",
    senha_placeholder:      "••••••••",
    btn_cancel:             "Cancelar",
    btn_enter:              "Entrar",
    login_error:            "E-mail ou senha incorretos. Tente novamente.",

    /* ── ADMIN ── */
    admin_breadcrumb:       "Painel Admin",
    admin_hero_title:       "Painel Administrativo",
    admin_hero_desc:        "Gerencie as UBS, visualize e finalize agendamentos do sistema.",
    admin_card_register:    "Cadastrar UBS",
    admin_card_register_desc: "Adicione uma nova Unidade Básica de Saúde",
    section_appointments:   "Agendamentos dos Usuários",
    manage_appt_title:      "Gerenciar Agendamentos",
    filter_status:          "Status:",
    filter_confirmed:       "Confirmados",
    filter_done:            "Realizados",
    filter_cancelled:       "Cancelados",
    filter_all:             "Todos",
    filter_ubs_label:       "UBS:",
    filter_ubs_all:         "Todas as UBS",
    loading_appt:           "Carregando agendamentos...",
    section_ubs:            "UBS Cadastradas",
    ubs_system_title:       "UBS no Sistema",
    loading_ubs:            "Carregando...",
    admin_logout:           "Sair",
    admin_back_portal:      "Voltar ao Portal",

    /* ── CADASTRAR UBS ── */
    cad_breadcrumb_parent:  "Painel Admin",
    cad_breadcrumb:         "Cadastrar UBS",
    cad_card_title:         "Cadastrar UBS",
    cad_section_dados:      "Dados da UBS",
    cad_nome_label:         "Nome da UBS",
    cad_nome_ph:            "Ex: UBS 24h de Santa Maria",
    cad_codigo_label:       "Código / Sigla",
    cad_codigo_ph:          "Ex: UBS-SM",
    cad_tipo_label:         "Tipo de Unidade",
    cad_tipo_select:        "Selecione",
    cad_gestao_label:       "Gestão",
    cad_gestao_select:      "Selecione",
    cad_gestao_publica:     "Pública",
    cad_gestao_privada:     "Privada",
    cad_gestao_filantropica:"Filantrópica",
    cad_cnes_label:         "CNES",
    cad_cnes_ph:            "Ex: 1234567",
    cad_cnes_help:          "Cadastro Nacional de Estabelecimentos de Saúde (7 dígitos)",
    cad_horario_label:      "Horário de Funcionamento",
    cad_horario_select:     "Selecione",
    cad_section_espec:      "Especialidades Disponíveis",
    cad_espec_desc:         "Marque as especialidades oferecidas por esta unidade. Selecione ao menos uma.",
    cad_section_horarios:   "Horários de Agendamento por Dia",
    cad_horarios_desc:      "Ative os dias e marque os horários disponíveis para agendamento. Ao menos um horário deve ser selecionado.",
    cad_required_notice:    "Campos marcados com * são obrigatórios.",
    btn_save:               "Salvar",

    cad_required_notice:    "Campos marcados com * são obrigatórios.",
btn_save:               "Salvar",

/* ── PDF ── */
pdf_title:              "Comprovante de Agendamento",
pdf_generated:          "Gerado em",
pdf_confirmed:          "✓ Agendamento Confirmado",
pdf_patient_data:       "Dados do Paciente",
pdf_full_name:          "Nome completo",
pdf_consult_data:       "Dados da Consulta",
pdf_health_unit:        "Unidade de Saúde",
pdf_specialty:          "Especialidade",
pdf_date:               "Data",
pdf_time:               "Horário",
pdf_important:          "⚠️ Informações Importantes",
pdf_notice:
  "Compareça com RG, CPF e cartão do SUS na data marcada. Cancelamentos devem ser realizados com pelo menos 24h de antecedência pelo site. Em caso de dúvidas, ligue para a Central de Atendimento: 156.",
pdf_footer:
  "Secretaria de Saúde do Distrito Federal · Central: 156 · Ouvidoria: 0800-644-0156",
},

  

  // ══════════════════════════════════════════════════════════
  //  ENGLISH
  // ══════════════════════════════════════════════════════════
  en: {

    /* ── GLOBAL ── */
    gov:                    "Government of the Federal District",
    gov_secao:              "Government of the Federal District — Health Department",
    gov_admin:              "Government of the Federal District — Admin Panel",
    admin_login:            "Admin Login",
    back_to_portal:         "Back to Portal",
    main_title:             "UBS Appointment Scheduling System",
    main_title_sm:          "UBS Appointment Scheduling System — SANTA MARIA",
    subtitle:               "Federal District Health Department · Santa Maria Administrative Region",
    footer_title:           "Federal District Health Department",
    footer_text:            "· UBS Appointment Scheduling System",
    footer_contact:         "Service Center: 156 · Ombudsman: 0800-644-0156",
    footer_rights:          "© 2026 GDF — All rights reserved",

    /* ── NAVBAR ── */
    home:                   "Home",
    schedule:               "Schedule Appointment",
    my_appointments:        "My Appointments",
    health_centers:         "Health Centers",
    admin_panel:            "Admin Panel",
    register_ubs:           "Register UBS",

    /* ── INDEX ── */
    hero_title:             "Online Appointment Scheduling",
    hero_desc:              "Schedule your appointment at Basic Health Units in Santa Maria – DF without leaving home. Choose the UBS, day and available time quickly and easily.",
    schedule_consultation:  "Schedule Appointment",
    schedule_desc:          "Choose the UBS, date and available time",
    appointments_desc:      "View and cancel active appointments",
    health_desc:            "UBS addresses and opening hours",
    important_notice:       "Appointments are personal and non-transferable. Bring your ID, CPF and SUS card on the scheduled date. Cancellations must be made at least 24 hours in advance.",
    how_title:              "How the scheduling works",
    step1_title:            "Select a Health Unit",
    step1_desc:             "Choose your preferred UBS in Santa Maria – DF.",
    step2_title:            "Choose a date and available time",
    step2_desc:             "View available slots on the calendar and select the most convenient one.",
    step3_title:            "Enter your personal details",
    step3_desc:             "Fill in your name and CPF to confirm.",
    step4_title:            "Receive your receipt",
    step4_desc:             "A PDF is generated to confirm your appointment.",

    /* ── AGENDAR ── */
    agendar_breadcrumb:     "Schedule Appointment",
    agendar_card_title:     "Schedule Appointment",
    select_ubs:             "Select the UBS",
    select_date:            "Select the Date",
    select_time:            "Select the Time",
    time_placeholder:       "Select UBS and date first",
    label_nome:             "Full name",
    nome_placeholder:       "Your full name",
    label_cpf:              "CPF",
    cpf_placeholder:        "000.000.000-00",
    label_especialidade:    "Specialty",
    select_placeholder:     "Select...",
    btn_confirm:            "Confirm appointment",
    cal_sun:                "Sun",
    cal_mon:                "Mon",
    cal_tue:                "Tue",
    cal_wed:                "Wed",
    cal_thu:                "Thu",
    cal_fri:                "Fri",
    cal_sat:                "Sat",
    success_title:          "Appointment confirmed!",
    success_sub:            "Your appointment has been successfully confirmed. Download the receipt below to keep the details.",
    btn_pdf:                "⬇ Download Receipt as PDF",
    btn_new_appt:           "Schedule another appointment",
    required_fields:        "All required fields (*) must be filled in.",

    /* ── MEUS AGENDAMENTOS ── */
    meus_breadcrumb:        "My Appointments",
    consult_title:          "View Appointments",
    consult_desc:           "Enter your CPF to view your appointments registered in this system.",
    label_cpf_busca:        "CPF",
    btn_search:             "Search",
    appt_results_title:     "My Appointments",
    appt_empty:             "Enter your CPF above to see your appointments.",

    /* ── POSTOS DE SAÚDE ── */
    postos_breadcrumb:      "Health Centers",
    postos_card_title:      "Basic Health Units — Santa Maria – DF",

    /* ── LOGIN ADMIN ── */
    login_breadcrumb:       "Admin Login",
    login_card_title:       "Administrative Access",
    login_notice:           "Restricted area. Access only for authorized administrators.",
    label_email:            "E-mail",
    label_senha:            "Password",
    senha_placeholder:      "••••••••",
    btn_cancel:             "Cancel",
    btn_enter:              "Sign In",
    login_error:            "Incorrect e-mail or password. Please try again.",

    /* ── ADMIN ── */
    admin_breadcrumb:       "Admin Panel",
    admin_hero_title:       "Admin Panel",
    admin_hero_desc:        "Manage health units, view and complete system appointments.",
    admin_card_register:    "Register UBS",
    admin_card_register_desc: "Add a new Basic Health Unit",
    section_appointments:   "User Appointments",
    manage_appt_title:      "Manage Appointments",
    filter_status:          "Status:",
    filter_confirmed:       "Confirmed",
    filter_done:            "Completed",
    filter_cancelled:       "Cancelled",
    filter_all:             "All",
    filter_ubs_label:       "UBS:",
    filter_ubs_all:         "All Health Units",
    loading_appt:           "Loading appointments...",
    section_ubs:            "Registered Health Units",
    ubs_system_title:       "Health Units in the System",
    loading_ubs:            "Loading...",
    admin_logout:           "Sign Out",
    admin_back_portal:      "Back to Portal",

    /* ── CADASTRAR UBS ── */
    cad_breadcrumb_parent:  "Admin Panel",
    cad_breadcrumb:         "Register UBS",
    cad_card_title:         "Register UBS",
    cad_section_dados:      "Health Unit Data",
    cad_nome_label:         "UBS Name",
    cad_nome_ph:            "E.g.: 24h UBS of Santa Maria",
    cad_codigo_label:       "Code / Abbreviation",
    cad_codigo_ph:          "E.g.: UBS-SM",
    cad_tipo_label:         "Unit Type",
    cad_tipo_select:        "Select",
    cad_gestao_label:       "Management",
    cad_gestao_select:      "Select",
    cad_gestao_publica:     "Public",
    cad_gestao_privada:     "Private",
    cad_gestao_filantropica:"Philanthropic",
    cad_cnes_label:         "CNES",
    cad_cnes_ph:            "E.g.: 1234567",
    cad_cnes_help:          "National Registry of Health Establishments (7 digits)",
    cad_horario_label:      "Operating Hours",
    cad_horario_select:     "Select",
    cad_section_espec:      "Available Specialties",
    cad_espec_desc:         "Check the specialties offered by this unit. Select at least one.",
    cad_section_horarios:   "Scheduling Hours by Day",
    cad_horarios_desc:      "Enable days and check the available times for scheduling. At least one time slot must be selected.",
    cad_required_notice:    "Fields marked with * are required.",
    btn_save:               "Save",

    cad_required_notice:    "Fields marked with * are required.",
btn_save:               "Save",

/* ── PDF ── */
pdf_title:              "Appointment Confirmation",
pdf_generated:          "Generated on",
pdf_confirmed:          "✓ Appointment Confirmed",
pdf_patient_data:       "Patient Information",
pdf_full_name:          "Full Name",
pdf_consult_data:       "Appointment Details",
pdf_health_unit:        "Health Unit",
pdf_specialty:          "Specialty",
pdf_date:               "Date",
pdf_time:               "Time",
pdf_important:          "⚠️ Important Information",
pdf_notice:
  "Please bring your ID, CPF and SUS card on the scheduled date. Cancellations must be made at least 24 hours in advance through the website. For questions, call 156.",
pdf_footer:
  "Federal District Health Department · Service Center: 156 · Ombudsman: 0800-644-0156",
  },

  // ══════════════════════════════════════════════════════════
  //  ESPAÑOL
  // ══════════════════════════════════════════════════════════
  es: {

    /* ── GLOBAL ── */
    gov:                    "Gobierno del Distrito Federal",
    gov_secao:              "Gobierno del Distrito Federal — Secretaría de Salud",
    gov_admin:              "Gobierno del Distrito Federal — Panel Administrativo",
    admin_login:            "Inicio Admin",
    back_to_portal:         "Volver al Portal",
    main_title:             "Sistema de Programación de Consultas — UBS",
    main_title_sm:          "Sistema de Programación de Consultas — UBS SANTA MARIA",
    subtitle:               "Secretaría de Salud del Distrito Federal · Región Administrativa de Santa Maria",
    footer_title:           "Secretaría de Salud del Distrito Federal",
    footer_text:            "· Sistema de Programación de Consultas UBS",
    footer_contact:         "Central de Atención: 156 · Defensoría: 0800-644-0156",
    footer_rights:          "© 2026 GDF — Todos los derechos reservados",

    /* ── NAVBAR ── */
    home:                   "Inicio",
    schedule:               "Programar Consulta",
    my_appointments:        "Mis Consultas",
    health_centers:         "Centros de Salud",
    admin_panel:            "Panel Admin",
    register_ubs:           "Registrar UBS",

    /* ── INDEX ── */
    hero_title:             "Programación de Consultas en Línea",
    hero_desc:              "Programe su consulta en las Unidades Básicas de Salud de Santa Maria – DF sin salir de casa. Elija la UBS, el día y el horario disponible de forma rápida y sencilla.",
    schedule_consultation:  "Programar Consulta",
    schedule_desc:          "Elija la UBS, fecha y horario disponible",
    appointments_desc:      "Consulte y cancele citas activas",
    health_desc:            "Direcciones y horarios de las UBS",
    important_notice:       "La cita es personal e intransferible. Presente RG, CPF y tarjeta SUS en la fecha programada. Las cancelaciones deben realizarse con al menos 24 horas de anticipación.",
    how_title:              "Cómo funciona la programación",
    step1_title:            "Seleccione el Centro de Salud",
    step1_desc:             "Elija la UBS de su preferencia en Santa Maria – DF.",
    step2_title:            "Elija fecha y horario disponible",
    step2_desc:             "Vea los horarios disponibles en el calendario y seleccione el más conveniente.",
    step3_title:            "Ingrese sus datos personales",
    step3_desc:             "Complete nombre y CPF para confirmar.",
    step4_title:            "Reciba el comprobante",
    step4_desc:             "Se genera un PDF para confirmar la cita.",

    /* ── AGENDAR ── */
    agendar_breadcrumb:     "Programar Consulta",
    agendar_card_title:     "Programar Consulta",
    select_ubs:             "Seleccione la UBS",
    select_date:            "Seleccione la Fecha",
    select_time:            "Seleccione el Horario",
    time_placeholder:       "Seleccione la UBS y la fecha primero",
    label_nome:             "Nombre completo",
    nome_placeholder:       "Su nombre completo",
    label_cpf:              "CPF",
    cpf_placeholder:        "000.000.000-00",
    label_especialidade:    "Especialidad",
    select_placeholder:     "Seleccione...",
    btn_confirm:            "Confirmar consulta",
    cal_sun:                "Dom",
    cal_mon:                "Lun",
    cal_tue:                "Mar",
    cal_wed:                "Mié",
    cal_thu:                "Jue",
    cal_fri:                "Vie",
    cal_sat:                "Sáb",
    success_title:          "¡Consulta programada con éxito!",
    success_sub:            "Su consulta fue confirmada con éxito. Descargue el comprobante a continuación para guardar los detalles.",
    btn_pdf:                "⬇ Descargar Comprobante en PDF",
    btn_new_appt:           "Programar otra consulta",
    required_fields:        "Todos los campos obligatorios (*) deben ser completados.",

    /* ── MEUS AGENDAMENTOS ── */
    meus_breadcrumb:        "Mis Consultas",
    consult_title:          "Consultar Citas",
    consult_desc:           "Ingrese su CPF para ver sus citas registradas en este sistema.",
    label_cpf_busca:        "CPF",
    btn_search:             "Buscar",
    appt_results_title:     "Mis Consultas",
    appt_empty:             "Ingrese su CPF arriba para ver sus citas.",

    /* ── POSTOS DE SAÚDE ── */
    postos_breadcrumb:      "Centros de Salud",
    postos_card_title:      "Unidades Básicas de Salud — Santa Maria – DF",

    /* ── LOGIN ADMIN ── */
    login_breadcrumb:       "Inicio Admin",
    login_card_title:       "Acceso Administrativo",
    login_notice:           "Área restringida. Acceso solo para administradores autorizados.",
    label_email:            "Correo electrónico",
    label_senha:            "Contraseña",
    senha_placeholder:      "••••••••",
    btn_cancel:             "Cancelar",
    btn_enter:              "Entrar",
    login_error:            "Correo o contraseña incorrectos. Inténtelo de nuevo.",

    /* ── ADMIN ── */
    admin_breadcrumb:       "Panel Admin",
    admin_hero_title:       "Panel Administrativo",
    admin_hero_desc:        "Administre las UBS, visualice y finalice citas del sistema.",
    admin_card_register:    "Registrar UBS",
    admin_card_register_desc: "Agregue una nueva Unidad Básica de Salud",
    section_appointments:   "Citas de los Usuarios",
    manage_appt_title:      "Gestionar Citas",
    filter_status:          "Estado:",
    filter_confirmed:       "Confirmadas",
    filter_done:            "Realizadas",
    filter_cancelled:       "Canceladas",
    filter_all:             "Todas",
    filter_ubs_label:       "UBS:",
    filter_ubs_all:         "Todas las UBS",
    loading_appt:           "Cargando citas...",
    section_ubs:            "UBS Registradas",
    ubs_system_title:       "UBS en el Sistema",
    loading_ubs:            "Cargando...",
    admin_logout:           "Salir",
    admin_back_portal:      "Volver al Portal",

    /* ── CADASTRAR UBS ── */
    cad_breadcrumb_parent:  "Panel Admin",
    cad_breadcrumb:         "Registrar UBS",
    cad_card_title:         "Registrar UBS",
    cad_section_dados:      "Datos de la UBS",
    cad_nome_label:         "Nombre de la UBS",
    cad_nome_ph:            "Ej: UBS 24h de Santa Maria",
    cad_codigo_label:       "Código / Sigla",
    cad_codigo_ph:          "Ej: UBS-SM",
    cad_tipo_label:         "Tipo de Unidad",
    cad_tipo_select:        "Seleccione",
    cad_gestao_label:       "Gestión",
    cad_gestao_select:      "Seleccione",
    cad_gestao_publica:     "Pública",
    cad_gestao_privada:     "Privada",
    cad_gestao_filantropica:"Filantrópica",
    cad_cnes_label:         "CNES",
    cad_cnes_ph:            "Ej: 1234567",
    cad_cnes_help:          "Registro Nacional de Establecimientos de Salud (7 dígitos)",
    cad_horario_label:      "Horario de Funcionamiento",
    cad_horario_select:     "Seleccione",
    cad_section_espec:      "Especialidades Disponibles",
    cad_espec_desc:         "Marque las especialidades ofrecidas por esta unidad. Seleccione al menos una.",
    cad_section_horarios:   "Horarios de Atención por Día",
    cad_horarios_desc:      "Active los días y marque los horarios disponibles para programación. Debe seleccionarse al menos un horario.",
    cad_required_notice:    "Los campos marcados con * son obligatorios.",
    btn_save:               "Guardar",

    cad_required_notice:    "Los campos marcados con * son obligatorios.",
btn_save:               "Guardar",

/* ── PDF ── */
pdf_title:              "Comprobante de Cita",
pdf_generated:          "Generado el",
pdf_confirmed:          "✓ Cita Confirmada",
pdf_patient_data:       "Datos del Paciente",
pdf_full_name:          "Nombre completo",
pdf_consult_data:       "Datos de la Consulta",
pdf_health_unit:        "Unidad de Salud",
pdf_specialty:          "Especialidad",
pdf_date:               "Fecha",
pdf_time:               "Hora",
pdf_important:          "⚠️ Información Importante",
pdf_notice:
  "Preséntese con RG, CPF y tarjeta SUS en la fecha programada. Las cancelaciones deben realizarse al menos 24 horas antes a través del sitio web. Para dudas, llame al 156.",
pdf_footer:
  "Secretaría de Salud del Distrito Federal · Central: 156 · Defensoría: 0800-644-0156",
  }
};

function changeLanguage(lang) {
  const t = translations[lang];
  if (!t) return;

  // Textos
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });

  // innerHTML (permite tags <strong> etc.)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  // Placeholders
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (t[key] !== undefined) el.placeholder = t[key];
  });

  // title / aria-label
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (t[key] !== undefined) el.title = t[key];
  });

  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    if (t[key] !== undefined) el.setAttribute('aria-label', t[key]);
  });

  // lang attribute on <html>
  const htmlEl = document.documentElement;
  if (lang === 'pt') htmlEl.lang = 'pt-BR';
  else if (lang === 'en') htmlEl.lang = 'en';
  else if (lang === 'es') htmlEl.lang = 'es';

  try { localStorage.setItem('lang', lang); } catch(e) {}

  // Sincroniza todos os selects de idioma
  document.querySelectorAll('.language-select').forEach(sel => { sel.value = lang; });

  // Atualiza barra de acessibilidade se já criada
  if (typeof window._acMudarIdioma === 'function') {
    // evita loop: accessibility.js chama changeLanguage, não _acMudarIdioma novamente
    window._atualizarTextosBarra_safe && window._atualizarTextosBarra_safe(lang);
  }
}

// ─────────────────────────────────────────────────────────────
//  Init — aplica idioma salvo no DOMContentLoaded
//  Padrão sempre PT se nunca foi trocado
// ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const saved = (() => {
    try { return localStorage.getItem('lang') || 'pt'; } catch(e) { return 'pt'; }
  })();
  changeLanguage(saved);
});

// ── Expõe globalmente ──
window.changeLanguage = changeLanguage;
window.translations   = translations;

console.log('translations.js carregado');