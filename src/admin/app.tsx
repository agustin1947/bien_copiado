import type { StrapiApp } from "@strapi/strapi/admin";

function limpiarDuplicadosLocalesButtons(id: any) {
  const botones = document.querySelectorAll(id);
  if (botones.length > 1) {
    botones.forEach((btn, index) => {
      if (index > 0) btn.remove();
    });
  }
}

async function insertarBotonesLocales(contentType: string) {
  const user = await getCurrentAdminUser();
  const roles = user.data.roles || [];

  const hasLocalA = roles.some((role: any) => role.name === "local-a");
  const hasLocalB = roles.some((role: any) => role.name === "local-b");
  const isSuperAdmin = roles.some(
    (role: any) => role.code === "strapi-super-admin",
  );

  limpiarDuplicadosLocalesButtons("#locales-buttons-gastos");
  if (document.getElementById("locales-buttons-gastos")) return;

  const containerAnchor = document.querySelector(
    '[data-strapi-header="true"] div:nth-child(2) a',
  ) as HTMLElement;

  if (containerAnchor) {
    containerAnchor.remove();
    containerAnchor.classList.add("d-none");
  }

  const container = document.querySelector(
    '[data-strapi-header="true"] div:nth-child(2)',
  ) as HTMLElement;

  if (!container) return;

  const btns = document.createElement("div");
  btns.id = "locales-buttons-gastos";

  if (
    contentType === "api::venta.venta" ||
    contentType === "api::cuenta-corriente.cuenta-corriente"
  ) {
    fetch("/api/locals")
      .then((res) => res.json())
      .then((data) => {
        if (!data?.data) return;

        let locals: any[] = data.data || [];
        if (!isSuperAdmin) {
          locals = locals.filter((local: any) => {
            if (hasLocalA && local.id === 1) {
              return true;
            }

            if (hasLocalB && local.id === 2) {
              return true;
            }

            return false;
          });
        }
        
        locals.forEach((local: any) => {
          fetch("/api/tipo-de-ventas")
            .then((res) => res.json())
            .then((tipos) => {
              if (!tipos?.data) return;
              tipos.data.forEach((tipoDeVenta: any) => {
                const a = document.createElement("a");
                a.href = `/admin/content-manager/collection-types/${contentType}/create?localId=${local.id}&tipoDeVentaId=${tipoDeVenta.id}`;
                a.innerText =
                  `${local.nombre} - ${tipoDeVenta.nombre}` ||
                  `Local ${local.id} - ${tipoDeVenta.id}`;
                a.classList.add("boton-local");
                btns.appendChild(a);
              });
            });
        });

        container.appendChild(btns);
      });
  } else {
    fetch("/api/locals")
      .then((res) => res.json())
      .then((data) => {
        if (!data?.data) return;
        data.data.forEach((local: any) => {
          const a = document.createElement("a");
          a.href = `/admin/content-manager/collection-types/${contentType}/create?localId=${local.id}`;
          a.innerText = `${local.nombre}` || `Local ${local.id}`;
          a.classList.add("boton-local");
          btns.appendChild(a);
        });
        container.appendChild(btns);
      });
  }

  limpiarDuplicadosLocalesButtons("#locales-buttons-gastos");
}

function observarPaginaConLocales() {
  const observer = new MutationObserver(() => {
    const pathname = window.location.pathname;
    let contentType: string | null = null;
    if (
      pathname.includes(
        "/admin/content-manager/collection-types/api::venta.venta",
      )
    ) {
      contentType = "api::venta.venta";
    }

    if (
      pathname.includes(
        "/admin/content-manager/collection-types/api::gasto.gasto",
      )
    ) {
      contentType = "api::gasto.gasto";
    }

    if (
      pathname.includes(
        "/admin/content-manager/collection-types/api::cuenta-corriente.cuenta-corriente",
      )
    ) {
      contentType = "api::cuenta-corriente.cuenta-corriente";
    }

    /*const isVentaList =
      pathname === "/admin/content-manager/collection-types/api::gasto.gasto";*/
    if (contentType) {
      insertarBotonesLocales(contentType);
    } else {
      document.getElementById("locales-buttons-gastos")?.remove();
      const containerAnchor = document.querySelector(
        '[data-strapi-header="true"] div:nth-child(2) a',
      ) as HTMLElement;
      if (containerAnchor && containerAnchor.classList.contains("d-none")) {
        containerAnchor.classList.remove("d-none");
      }
    }
  });

  observer.observe(document.body, {
    childList: true, // detecta nodos agregados o eliminados
    subtree: true, // detecta cambios dentro de hijos
  });
}

function bloquearBotones() {
  const observer = new MutationObserver(() => {
    // bloquear botones con aria-haspopup="menu", dentro de formularios
    const buttonsHasPopup = document.querySelectorAll(
      'form button[aria-haspopup="menu"]',
    );

    buttonsHasPopup.forEach((btn) => {
      btn.disabled = true;
      btn.style.pointerEvents = "none";
      btn.style.display = "none";
    });

    const buttonsHasDialog = document.querySelectorAll(
      'button[aria-haspopup="dialog"]',
    );
    buttonsHasDialog.forEach((btn, index) => {
      if (index == 1) {
        btn.disabled = true;
        btn.style.pointerEvents = "none";
        btn.style.display = "none";
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function customHome() {
  const observer = new MutationObserver(() => {
    const path = window.location.pathname;

    if (path === "/admin" || path === "/admin/") {
      const main = document.querySelectorAll("#main-content  > div")[1];

      if (!main) return;

      // Evitar duplicados
      if (document.getElementById("custom-home")) return;

      // Limpiar contenido
      main.innerHTML = "";

      // Crear contenedor principal
      const container = document.createElement("div");
      container.id = "custom-home";
      container.className = "custom-home-container";

      // Título
      //const title = document.createElement("h1");
      //title.innerText = "Bienvenido 👋";
      //title.className = "custom-home-title";

      // Grid
      const grid = document.createElement("div");
      grid.className = "custom-home-grid";

      const items = [
        {
          name: "Ventas",
          url: "/admin/content-manager/collection-types/api::venta.venta",
          icon: "💰",
        },
        {
          name: "Productos",
          url: "/admin/content-manager/collection-types/api::producto.producto",
          icon: "📦",
        },
        {
          name: "Service",
          url: "/admin/content-manager/collection-types/api::service.service",
          icon: "🔧",
        },
        {
          name: "Caja diaria",
          url: "/admin/content-manager/collection-types/api::caja-diaria.caja-diaria",
          icon: "📊",
        },
      ];

      items.forEach((item) => {
        const card = document.createElement("a");
        card.href = item.url;
        card.className = "custom-home-card";

        const icon = document.createElement("div");
        icon.innerText = item.icon;
        icon.className = "custom-home-icon";

        const label = document.createElement("div");
        label.innerText = item.name;
        label.className = "custom-home-label";

        card.appendChild(icon);
        card.appendChild(label);
        grid.appendChild(card);
      });

      //container.appendChild(title);
      container.appendChild(grid);

      main.appendChild(container);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift();
  }

  return null;
}

async function getCurrentAdminUser() {
  const token = getCookie("jwtToken");

  if (!token) {
    throw new Error("No se encontró el token");
  }

  const response = await fetch("/admin/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener el usuario");
  }

  return response.json();
}

export default {
  config: {
    locales: [
      // 'ar',
      // 'fr',
      // 'cs',
      // 'de',
      // 'dk',
      "es",
      // 'he',
      // 'id',
      // 'it',
      // 'ja',
      // 'ko',
      // 'ms',
      // 'nl',
      // 'no',
      // 'pl',
      // 'pt-BR',
      // 'pt',
      // 'ru',
      // 'sk',
      // 'sv',
      // 'th',
      // 'tr',
      // 'uk',
      // 'vi',
      // 'zh-Hans',
      // 'zh',
    ],
    translations: {
      es: {
        "HomePage.header.title": "Hola {name}",
        "HomePage.header.subtitle": "Bienvenido a su panel de administración",
        "global.home": "Página principal",
        "global.plugins.content-manager": "Gestor de contenidos",

        "content-manager.content-types.api::venta.venta.createdAt": "Creado",
        "content-manager.content-types.api::venta.venta.total": "Total",
        "content-manager.content-types.api::venta.venta.local": "Local",
        "content-manager.content-types.api::venta.venta.tipo_de_venta":
          "Tipo de venta",
        "content-manager.content-types.api::venta.venta.forma_de_pago":
          "Forma de pago",
        "content-manager.content-types.api::venta.venta.tipo_de_moneda":
          "Tipo de moneda",
        "content-manager.content-types.api::venta.venta.total_ganancia":
          "Total ganancia",
        "content-manager.content-types.api::venta.venta.apellido": "Apellido",
        "content-manager.content-types.api::venta.venta.nombre": "Nombre",
        "content-manager.content-types.api::venta.venta.id": "Id",
        "content-manager.content-types.api::venta.venta.saldo_inicial_pesos":
          "Saldo inicial pesos",

        "content-manager.content-types.api::tipo-de-venta.tipo-de-venta.updatedAt":
          "Editado",
        "content-manager.content-types.api::tipo-de-venta.tipo-de-venta.createdAt":
          "Creado",
        "content-manager.content-types.api::tipo-de-venta.tipo-de-venta.nombre":
          "Nombre",
        "content-manager.content-types.api::tipo-de-venta.tipo-de-venta.id":
          "Id",
        "content-manager.content-types.api::tipo-de-venta.tipo-de-venta.forma_de_pago":
          "Forma de pago",

        "content-manager.content-types.api::service.service.estado_de_service":
          "Estado de service",
        "content-manager.content-types.api::service.service.fecha_de_ingreso":
          "Fecha de ingreso",
        "content-manager.content-types.api::service.service.total_gasto":
          "Total gasto",
        "content-manager.content-types.api::service.service.descripcion_gasto":
          "Descripción gasto",
        "content-manager.content-types.api::service.service.email": "Email",
        "content-manager.content-types.api::service.service.id": "Id",
        "content-manager.content-types.api::service.service.title_section_estados_del_equipo":
          "Estados del equipo al ingreso",
        "content-manager.content-types.api::service.service.title_section_gastos":
          "Gastos",
        "content-manager.content-types.api::service.service.title_section_condiciones_de_servicio":
          "Condiciones de Servicio",
        "content-manager.content-types.api::service.service.title_section_observaciones_del_tecnico":
          "Observaciones del técnico",
        "content-manager.content-types.api::service.service.title_section_trabajo_solicitado_por_cliente":
          "Trabajo solicitado por el cliente",
        "content-manager.content-types.api::service.service.title_section":
          "Título de sección",
        "content-manager.content-types.api::service.service.ganancia":
          "Ganancia",
        "content-manager.content-types.api::service.service.rayaduras":
          "Rayaduras",
        "content-manager.content-types.api::service.service.otros": "Otros",
        "content-manager.content-types.api::service.service.icloud_desactivado":
          "Icloud desactivado",
        "content-manager.content-types.api::service.service.icloud_activo":
          "Icloud activo",
        "content-manager.content-types.api::service.service.golpes": "Golpes",
        "content-manager.content-types.api::service.service.pantalla_daniada":
          "Pantalla dañada",
        "content-manager.content-types.api::service.service.no_enciende":
          "No enciende",
        "content-manager.content-types.api::service.service.enciende":
          "Enciende",
        "content-manager.content-types.api::service.service.condiciones_del_servicio":
          "Condiciones del servicio",
        "content-manager.content-types.api::service.service.observaciones_del_tecnico":
          "Observaciones del técnico",
        "content-manager.content-types.api::service.service.trabajo_solicitado_por_el_cliente":
          "Trabajo solicitado por el cliente",
        "content-manager.content-types.api::service.service.imei": "IMEI",
        "content-manager.content-types.api::service.service.modelo": "Modelo",
        "content-manager.content-types.api::service.service.marca": "Marca",
        "content-manager.content-types.api::service.service.descripcion_estado_del_equipo":
          "Descripción del equipo",
        "content-manager.content-types.api::service.service.numero_de_orden":
          "N° de orden",
        "content-manager.content-types.api::service.service.cliente": "Cliente",
        "content-manager.content-types.api::service.service.comercio":
          "Comercio",
        "content-manager.content-types.api::service.service.total": "Total",
        "content-manager.content-types.api::service.service.local": "Local",
        "content-manager.content-types.api::service.service.telefono":
          "Teléfono",
        "content-manager.content-types.api::service.service.forma_de_pago":
          "Forma de pago",
        "content-manager.content-types.api::service.service.simbolo": "Símbolo",
        "content-manager.content-types.api::service.service.codigo": "Código",
        "content-manager.content-types.api::service.service.nombre": "Nombre",
        "content-manager.content-types.api::service.service.fecha_de_entrega":
          "Fecha de entrega",
        "content-manager.content-types.api::service.service.pagos_parciales":
          "Pagos parciales",

        "content-manager.content-types.api::remito.remito.fecha": "Fecha",
        "content-manager.content-types.api::remito.remito.telefono": "Teléfono",
        "content-manager.content-types.api::remito.remito.nombreYApellido":
          "Nombre y apellido",
        "content-manager.content-types.api::remito.remito.id": "Id",
        "content-manager.content-types.api::remito.remito.local": "Local",
        "content-manager.content-types.api::remito.remito.cantidad": "Cantidad",
        "content-manager.content-types.api::remito.remito.precio": "Precio",
        "content-manager.content-types.api::remito.remito.descripcion":
          "Descripción",

        "content-manager.content-types.api::producto.producto.createdAt":
          "Creado",
        "content-manager.content-types.api::producto.producto.stock": "Stock",
        "content-manager.content-types.api::producto.producto.locales":
          "Locales",
        "content-manager.content-types.api::producto.producto.precio":
          "Precio público",
        "content-manager.content-types.api::producto.producto.descripcion":
          "Descripción",
        "content-manager.content-types.api::producto.producto.nombre": "Nombre",
        "content-manager.content-types.api::producto.producto.id": "Id",
        "content-manager.content-types.api::producto.producto.precio_compra":
          "Precio costo",
        "content-manager.content-types.api::producto.producto.precio_mayorista":
          "Precio Mayorista",
        "content-manager.content-types.api::producto.producto.tipo_de_moneda":
          "Tipo de moneda",

        "content-manager.components.productos.productos.ganancia_por_item":
          "Ganancia por ítem",
        "content-manager.components.productos.productos.total": "Total",
        "content-manager.components.productos.productos.cantidad": "Cantidad",
        "content-manager.components.productos.productos.productoItem":
          "Producto",
        "content-manager.components.productos.productos.cantidadOriginal":
          "Cantidad original",
        "content-manager.components.productos.productos.idProductoOriginal":
          "ID producto original",

        "content-manager.components.DynamicZone.add-item-below": "Agregar ítem",
        "content-manager.components.DynamicZone.add-item-above": "Agregar ítem",
        "content-manager.components.DynamicZone.more-actions": "Más acciones",

        "content-manager.components.gastos.gastos-items.total_por_item":
          "Total",
        "content-manager.components.gastos.gastos-items.precio_por_unidad":
          "Precio",
        "content-manager.components.gastos.gastos-items.cantidad": "Cantidad",
        "content-manager.components.gastos.gastos-items.nombre_producto_nuevo":
          "Nombre producto nuevo",
        "content-manager.components.gastos.gastos-items.producto":
          "Gastos item producto",

        "content-manager.content-types.api::gasto-diario.gasto-diario.fecha_de_ingreso":
          "Fecha de ingreso",
        "content-manager.content-types.api::gasto-diario.gasto-diario.local":
          "Local",
        "content-manager.content-types.api::gasto-diario.gasto-diario.forma_de_pago":
          "Forma de pago",
        "content-manager.content-types.api::gasto-diario.gasto-diario.tipo_de_moneda":
          "Tipo de moneda",
        "content-manager.content-types.api::gasto-diario.gasto-diario.total":
          "Total",
        "content-manager.content-types.api::gasto-diario.gasto-diario.descripcion":
          "Descripción",
        "content-manager.content-types.api::gasto-diario.gasto-diario.id": "Id",

        "content-manager.content-types.api::venta.venta.sales_detect_changes_in_items":
          "Se detectaron cambios en los ítems de la venta",
        "content-manager.content-types.api::venta.venta.fecha_de_ingreso":
          "Fecha de ingreso",
        "content-manager.content-types.api::venta.venta.Productos": "Productos",
        "content-manager.content-types.api::venta.venta.descripcion":
          "Descripción",
        "content-manager.content-types.api::venta.venta.email": "Email",
        "content-manager.content-types.api::venta.venta.dni": "DNI",
        "content-manager.content-types.api::venta.venta.telefono": "Teléfono",
        "content-manager.content-types.api::venta.venta.nombre_venta": "Nombre",
        "content-manager.content-types.api::venta.venta.nombre_local":
          "Nombre local",
        "content-manager.content-types.api::venta.venta.formas_de_pago":
          "Formas de pago",

        "formas-de-pago": "Formas de pago",
        "content-manager.components.formas-de-pago.formas-de-pago.forma_de_pago":
          "Forma de pago",
        "content-manager.components.formas-de-pago.formas-de-pago.total":
          "Total",

        "content-manager.content-types.api::local.local.telefono": "Teléfono",
        "content-manager.content-types.api::local.local.direccion": "Dirección",
        "content-manager.content-types.api::local.local.nombre": "Nombre",
        "content-manager.content-types.api::local.local.id": "Id",
        "content-manager.content-types.api::local.local.email": "Email",

        "content-manager.content-types.api::gasto.gasto.telefono": "Teléfono",
        "content-manager.content-types.api::gasto.gasto.email": "Email",
        "content-manager.content-types.api::gasto.gasto.proveedor": "Proveedor",
        "content-manager.content-types.api::gasto.gasto.id": "Id",
        "content-manager.content-types.api::gasto.gasto.Gastos": "Gastos",
        "content-manager.content-types.api::gasto.gasto.total": "Total",
        "content-manager.content-types.api::gasto.gasto.fecha_de_ingreso":
          "Fecha de ingreso",
        "content-manager.content-types.api::gasto.gasto.tipo_de_moneda":
          "Tipo de moneda",
        "content-manager.content-types.api::gasto.gasto.local": "Local",

        "content-manager.content-types.api::estado-de-service.estado-de-service.descripcion":
          "Descripción",
        "content-manager.content-types.api::estado-de-service.estado-de-service.createdAt":
          "Creado",
        "content-manager.content-types.api::estado-de-service.estado-de-service.nombre":
          "Nombre",
        "content-manager.content-types.api::estado-de-service.estado-de-service.id":
          "Id",
        "content-manager.content-types.api::estado-de-service.estado-de-service.color":
          "Color",

        "content-manager.content-types.api::caja-diaria.caja-diaria.saldo_inicial_pesos":
          "Saldo inicial pesos",
        "content-manager.content-types.api::caja-diaria.caja-diaria.ver-caja-diaria":
          "Ver caja diaria",
        "content-manager.content-types.api::caja-diaria.caja-diaria.ver_caja_diaria":
          "Ver caja diaria",
        "content-manager.content-types.api::caja-diaria.caja-diaria.local":
          "Local",
        "content-manager.content-types.api::caja-diaria.caja-diaria.saldo_inicial_dolar":
          "Saldo inicial dólar",
        "content-manager.content-types.api::caja-diaria.caja-diaria.createdAt":
          "Creado",
        "content-manager.content-types.api::caja-diaria.caja-diaria.id": "Id",
        "content-manager.content-types.api::caja-diaria.caja-diaria.fecha_de_ingreso":
          "Fecha de ingreso",

        "content-manager.content-types.api::tipo-de-moneda.tipo-de-moneda.simbolo":
          "Símbolo",
        "content-manager.content-types.api::tipo-de-moneda.tipo-de-moneda.id":
          "Id",
        "content-manager.content-types.api::tipo-de-moneda.tipo-de-moneda.nombre":
          "Nombre",
        "content-manager.content-types.api::tipo-de-moneda.tipo-de-moneda.codigo":
          "Código",

        "content-manager.content-types.api::ingreso.ingreso.monto": "Monto",
        "content-manager.content-types.api::ingreso.ingreso.descripcion":
          "Descripción",
        "content-manager.content-types.api::ingreso.ingreso.fecha_de_ingreso":
          "Fecha de ingreso",
        "content-manager.content-types.api::ingreso.ingreso.local": "Local",
        "content-manager.content-types.api::ingreso.ingreso.tipo_de_moneda":
          "Tipo de moneda",
        "content-manager.content-types.api::ingreso.ingreso.forma_de_pago":
          "Forma de pago",
        "content-manager.content-types.api::ingreso.ingreso.titulo": "Título",
        "content-manager.content-types.api::ingreso.ingreso.n_orden_cc":
          "N° de orden Cuenta Corriente (opcional)",
        "content-manager.content-types.api::ingreso.ingreso.n_orden_st":
          "N° de orden Servicio Técnico (opcional)",
        "content-manager.content-types.api::ingreso.ingreso.id": "Id",
        "content-manager.content-types.api::ingreso.ingreso.total": "Total",

        "content-manager.content-types.api::cliente.cliente.nombre": "Nombre",
        "content-manager.content-types.api::cliente.cliente.apellido":
          "Apellido",
        "content-manager.content-types.api::cliente.cliente.telefono":
          "Teléfono",
        "content-manager.content-types.api::cliente.cliente.id": "Id",
        "content-manager.content-types.api::cliente.cliente.nombre_completo":
          "Nombre completo",
        "content-manager.content-types.api::cliente.cliente.createdAt":
          "Creado",

        "content-manager.content-types.api::cuenta-corriente.cuenta-corriente.Productos":
          "Productos",
        "content-manager.content-types.api::cuenta-corriente.cuenta-corriente.local":
          "Local",
        "content-manager.content-types.api::cuenta-corriente.cuenta-corriente.cliente":
          "Cliente",
        "content-manager.content-types.api::cuenta-corriente.cuenta-corriente.numero_de_orden":
          "N° de orden",
        "content-manager.content-types.api::cuenta-corriente.cuenta-corriente.fecha_de_ingreso":
          "Fecha de ingreso",

        "content-manager.content-types.api::categoria-de-producto.categoria-de-producto.saldo_inicial_pesos":
          "Saldo inicial en pesos",
        "content-manager.content-types.api::categoria-de-producto.categoria-de-producto.nombre":
          "Nombre",
        "content-manager.content-types.api::categoria-de-producto.categoria-de-producto.id":
          "Id",
        "content-manager.content-types.api::categoria-de-producto.categoria-de-producto.descripcion":
          "Descripción",
        "content-manager.content-types.api::categoria-de-producto.categoria-de-producto.createdAt":
          "Creado",
        "content-manager.content-types.api::producto.producto.categoria_de_producto":
          "Categoría de producto",
        "content-manager.content-types.api::categoria-de-producto.categoria-de-producto.cliente":
          "Cliente",
        "content-manager.content-types.api::categoria-de-producto.categoria-de-producto.numero_de_orden":
          "N° de orden",
        "content-manager.content-types.api::categoria-de-producto.categoria-de-producto.fecha_de_ingreso":
          "Fecha de ingreso",
        "content-manager.content-types.api::categoria-de-producto.categoria-de-producto.telefono":
          "Teléfono",
        "content-manager.content-types.api::categoria-de-producto.categoria-de-producto.nombre_completo":
          "Nombre completo",

        "content-manager.content-types.api::forma-de-pago.forma-de-pago.id":
          "Id",
        "content-manager.content-types.api::forma-de-pago.forma-de-pago.nombre":
          "Nombre",
        "content-manager.content-types.api::forma-de-pago.forma-de-pago.createdAt":
          "Creado",
        "content-manager.content-types.api::forma-de-pago.forma-de-pago.updatedAt":
          "Editado",

        "content-manager.content-types.api::cuenta-corriente.cuenta-corriente.id":
          "ID",
        "content-manager.components.cuenta-corriente.cuenta-corriente-items.ganancia_por_item":
          "Ganancia",
        "content-manager.components.cuenta-corriente.cuenta-corriente-items.total":
          "Total",
        "content-manager.components.cuenta-corriente.cuenta-corriente-items.cantidad":
          "Cantidad",
        "content-manager.components.cuenta-corriente.cuenta-corriente-items.productoItem":
          "Producto item",
        "content-manager.content-types.api::cuenta-corriente.cuenta-corriente.sales_detect_changes_in_items":
          "Detectar cambios en items",
        "content-manager.components.cuenta-corriente.cuenta-corriente-items.idProductoOriginal":
          "ID producto original",
        "content-manager.components.cuenta-corriente.cuenta-corriente-items.cantidadOriginal":
          "Cantidad Original",
        "content-manager.content-types.api::cuenta-corriente.cuenta-corriente.pagos_parciales":
          "Pagos Parciales",
        "ontent-manager.content-types.api::cuenta-corriente.cuenta-corriente.telefono":
          "Teléfono",
        "content-manager.content-types.api::cuenta-corriente.cuenta-corriente.nombre_completo":
          "Nombre completo",
        "content-manager.content-types.api::cuenta-corriente.cuenta-corriente.createdAt":
          "Creado",

        "content-manager.content-types.api::cuenta-corriente.cuenta-corriente.total":
          "Total",
        "content-manager.content-types.api::cuenta-corriente.cuenta-corriente.tipo_de_moneda":
          "Tipo de moneda",

        "my-custom-fields.plugin.name": "Reporte mensual",

        "content-manager.plugin.name": "Gestor de contenidos",
        "app.utils.drag": "Drag",
        "productos.productos": "Productos",
        productos: "Productos",
        "gastos.gastos-items": "Gastos items",
        "api::venta.venta": "Venta",
        "plugin::users-permissions.user": "Usuario",
        "api::tipo-de-venta.tipo-de-venta": "Tipo de venta",
        "api::service.service": "Service",
        "api::remito.remito": "Remito",
        "api::producto.producto": "Productos",
        "plugin::strapi-plugin-pdf-creator.template": "PDF Template",
        "api::local.local": "Local",
        "api::gasto.gasto": "Gastos",
        "api::estado-de-service.estado-de-service": "Estado de service",
        "content-type-builder.search.placeholder": "buscar",
        "global.more.actions": "Más",
        "app.utils.toggle": "Toggle",
        "Settings.application.header": "Encabezado",
        "review-workflows.plugin.name": "Nombre",
        //Menu

        "PDF Templates": "PDF Templates",
        User: "Usuario",
        "Tipo de moneda": "Tipo de moneda",
        "Forma de pago": "Forma de pago",
        "Caja Diaria": "Caja Diaria",
        "estado de service": "Estado de service",
        "gasto diario": "Gastos diarios",
        Gastos: "Gastos",
        gastos: "Gastos",
        "tipo de venta": "Tipo de ventas",
        service: "Service",
        remito: "Remitos",
        producto: "Productos",
        local: "Local",
        gasto: "Gastos",
        venta: "Ventas",
        ingreso: "Ingresos",
        Cliente: "Cliente",
        "Cuenta Corriente": "Cuenta Corriente",
        "cuenta-corriente": "Cuenta Corriente",
        "Categoría de producto": "Categoría de producto",
      },
    },
    theme: {
      light: {
        colors: {
          primary100: "#FFEBEE",
          primary200: "#FFCDD2",
          primary500: "#F44336", // rojo principal
          primary600: "#E53935", // hover
          primary700: "#D32F2F", // activo

          buttonPrimary500: "#F44336",
          buttonPrimary600: "#E53935",
          buttonPrimary700: "#D32F2F",
        },
      },
    },
  },
  bootstrap(app: StrapiApp) {
    customHome();
    observarPaginaConLocales();
    bloquearBotones();
    const style = document.createElement("style");
    style.innerHTML = `
    nav ol li ol li:nth-child(11),
      nav ol li ol li:nth-child(17),
      nav ul li:not(:nth-child(1)):not(:nth-child(2)):not(:nth-child(5)),
      nav:not([aria-label="Pagination"]) ol li span {
        display: none !important;
    }
    .hidden-delete {
      display: none;
      visibility: hidden;
      pointer-events: none;
     }
      /* bloque para evitar que se corten los select genericos */
      [data-state='open']{
        overflow: unset !important;
      }
      #main-content div:first-child div:first-child img ~ div{
        display: none !important;
      }
      nav div div img {
        background-color:red;
      }
      #locales-buttons,
      #locales-buttons-gastos {
        display: flex;
        gap: 5px
      }
      .container-btn {
        width: 100%;
        display: flex;
        border: 1px solid #eaeaef;
        padding: 15px;
      }
      .boton-local {
        background-color:#E53935;
        color:#FFFFFF;
        padding: 7px 15px; 
        border-radius:4px;
        text-decoration:none;
        font-size:1.2rem;
        font-weight:600;
        text-align:center;
        cursor: pointer;
      }
      .boton-local--download {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
      }
      .w-100 {
        width: 100% !important;
      }
      .d-none {
        display: none !important;
      }
      .input-customize {
        position: relative;
        border: 1px solid #dcdce4;
        border-radius: 4px;
        background: #ffffff;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding-inline-start: 16px;
        padding-inline-end: 12px;
        padding-block: 8px;
        outline: none;
        box-shadow: none;
        transition-property: border-color, box-shadow, fill;
        transition-duration: 0.2s;
        font-size:1.4rem;
        width: 100%;
      }
      .input-description {
        font-size: 1.2rem;
        line-height: 1.33;
        color: #666687;
        margin-top: 5px;
      }
      .label-customize {
        font-size: 1.2rem;
        line-height: 1.33;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #32324d;
        font-weight: 600;
        padding:0 0 5px 0;
      }
      .p-1 {
        padding:10px 0;
      }
      h1{
        text-transform: capitalize;
      }
      .h1 {
        font-weight: 600;
        font-size: 2.5rem;
        line-height: 1.25;
      }
      .container-number-currency {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 15px;
        font-weight: bold;
      }
      .table {
        border-top: 1px solid #dcdce4;
        border-right: 1px solid #dcdce4;
      }
      .table thead {
        background-color: #eaeaef;
      }  
      .table thead tr th, .table tbody tr td{
        padding:10px 0;
        font-size:14px;
        border-bottom: 1px solid #dcdce4;
        text-align:center;
        border-left:1px solid #dcdce4;
      }  
      input[name=numero_de_orden],
      input[name=comercio] {
        pointer-events: none;   /* no se puede clickear ni escribir */
        background-color: #f5f5f5;
        color: #333;
        border-color: #ddd;
      } 

      /* Componente GenericSearchableSelect */
      .generic_searchable_select {
        cursor: pointer;
        position: relative;
      }  
      .generic_searchable_select__select {
          position: relative;
          width: 100%; 
      }
      .generic_searchable_select__ul {
        border: 1px solid #dcdce4;
        border-radius:4px;
        margin-top:5px;
        position: absolute;
        top: 60px;
        width:100%;
        background-color:#FFF;
        z-index:10;
        max-height:185px;
        overflow-x: hidden
      }
      .generic_searchable_select__ul li {
        padding:10px;
      }
      .generic_searchable_select__li {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        outline: none;
        box-shadow: none;
        transition-property: border-color, box-shadow, fill;
        transition-duration: 0.2s;
        font-size:1.4rem;
        width: 100%;
        border-top:1px solid #dcdce4;
      }  
      .generic_searchable_select__li:hover {
        background-color:#FFEBEE;
      }
      .generic_searchable_select__select span {
          position: absolute;
          right: 10px;
          top: 10px;
      }
      .arrow {
          display: inline-block;
          transition: transform 0.3s ease;
      }
      .arrow_up {
          transform: rotate(180deg)
      }
      /* End Componente GenericSearchableSelect */
      
      /** CategoryProductSelect */
      .category_product_select {
        display: inline-flex;
        gap: 10px;
        width: 100%;
      }
      .category_product_select .generic_searchable_select {
        width: 50%;
      }
      /** end category_product_select*/
      
      /** SelectCustomize */
      .select_customize__description {
        margin: 10px 0;
      }
      /** end SelectCustomize */
      /** FiltersByYearAndMonth */
      .filters {
        display: flex;
        gap:10px;
      }
      .filters_filter {
        width: 50%;
      }

      /** end FiltersByYearAndMonth */

      .container {
        padding: 56px;
        display:grid;
        gap:20px;
      }
      .title_h1 {
        font-weight: 600;
        font-size: 3.2rem;
        line-height: 1.25;
      }
      .title_h3 {
        font-weight: 600;
        font-size: 2.5rem;
        line-height: 1;
        padding-bottom:15px;
      }

      .reports {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
      }

      /* Cada tabla ocupa 50% (2 por fila) */
      .reports_table {
        flex: 1 1 calc(50% - 20px);
        background: #FFF;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 0 21px -17px black;
      }

      /* La tercera tabla ocupa toda la fila */
      .reports_table:nth-child(3) {
        flex: 1 1 100%;
      }

      .custom-home-title {
        font-size: 32px;
        margin-bottom: 30px;
      }

      .custom-home-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
      }

      .custom-home-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 140px;
        background: white;
        border-radius: 8px;
        text-decoration: none;
        color: black;
        box-shadow: 0 0 20px -10px rgba(0,0,0,0.3);
        transition: 0.2s;
      }

      .custom-home-icon {
        font-size: 32px;
        margin-bottom: 10px;
      }

      .custom-home-label {
        font-size: 16px;
        font-weight: 600;
      }

      @media (max-width: 992px) {
        .reports_table {
          flex: 1 1 100%;
        } 
        #main-content {
          margin: 0 20px !important;
          padding:0;
        }
        #main-content div:first-child {
          width:100%;
        }
        #main-content div div div:nth-child(2){
          display: block;
        }
        nav ~ div div nav {
          position: absolute !important;
          left: -100%;
        }
        .show {
          left:55px !important;
        } 
      }
    `;
    document.head.appendChild(style);
    /* evento para ocultar/mostrar nav */
    const interval = setInterval(() => {
      const logo = document.querySelector(
        "nav > div > div > img",
      ) as HTMLElement;
      const menu = document.querySelector("nav ~ div div nav") as HTMLElement;

      if (logo) {
        logo.style.cursor = "pointer";

        logo.addEventListener("click", () => {
          const menu = document.querySelector(
            "nav ~ div div nav",
          ) as HTMLElement;
          if (menu) {
            menu.classList.toggle("show");
          }
        });

        clearInterval(interval);
      }
    }, 500);
    /** agrego boton para realizar descarga de remito en ventas */
    app
      .getPlugin("content-manager")
      .injectComponent("editView", "right-links", {
        name: "venta-pdf-remito",
        Component: (props: any) => {
          const { slug } = props;

          if (slug !== "api::venta.venta") return null;

          const segments = window.location.pathname.split("/");
          const documentId = segments[segments.length - 1];

          if (documentId === "create") return null;

          return (
            <div className="container-btn">
              <a
                className="boton-local boton-local--download"
                href={`/api/venta/${documentId}/export-pdf`}
                target="_blank"
              >
                Remito
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  width="16"
                  height="16"
                  fill="currentColor"
                >
                  <path d="M28.5 19v7a2.5 2.5 0 0 1-2.5 2.5H6A2.5 2.5 0 0 1 3.5 26v-7a1.5 1.5 0 0 1 3 0v6.5h19V19a1.5 1.5 0 1 1 3 0m-13.561 1.061a1.5 1.5 0 0 0 2.125 0l5-5a1.502 1.502 0 1 0-2.125-2.125L17.5 15.375V5a1.5 1.5 0 1 0-3 0v10.375l-2.439-2.436a1.502 1.502 0 1 0-2.125 2.125z"></path>
                </svg>
              </a>
            </div>
          );
        },
      });

    /** agrego boton para generar reporte en caja diaria */
    app
      .getPlugin("content-manager")
      .injectComponent("editView", "right-links", {
        name: "venta-pdf-reporte",
        Component: (props: any) => {
          const { slug } = props;

          if (slug !== "api::caja-diaria.caja-diaria") return null;

          const segments = window.location.pathname.split("/");
          const documentId = segments[segments.length - 1];

          if (documentId === "create") return null;

          return (
            <div className="container-btn">
              <a
                className="boton-local boton-local--download"
                href={`/export-csv/export/caja-diaria/${documentId}`}
              >
                Reporte
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  width="16"
                  height="16"
                  fill="currentColor"
                >
                  <path d="M28.5 19v7a2.5 2.5 0 0 1-2.5 2.5H6A2.5 2.5 0 0 1 3.5 26v-7a1.5 1.5 0 0 1 3 0v6.5h19V19a1.5 1.5 0 1 1 3 0m-13.561 1.061a1.5 1.5 0 0 0 2.125 0l5-5a1.502 1.502 0 1 0-2.125-2.125L17.5 15.375V5a1.5 1.5 0 1 0-3 0v10.375l-2.439-2.436a1.502 1.502 0 1 0-2.125 2.125z"></path>
                </svg>
              </a>
            </div>
          );
        },
      });

    /** agrego boton para realizar descarga de remito en ventas */
    app
      .getPlugin("content-manager")
      .injectComponent("editView", "right-links", {
        name: "service-pdf-remito",
        Component: (props: any) => {
          const { slug } = props;

          if (slug !== "api::service.service") return null;

          const segments = window.location.pathname.split("/");
          const documentId = segments[segments.length - 1];

          if (documentId === "create") return null;

          return (
            <div className="container-btn">
              <a
                className="boton-local boton-local--download"
                href={`/api/service/${documentId}/export-pdf`}
                target="_blank"
              >
                Remito
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  width="16"
                  height="16"
                  fill="currentColor"
                >
                  <path d="M28.5 19v7a2.5 2.5 0 0 1-2.5 2.5H6A2.5 2.5 0 0 1 3.5 26v-7a1.5 1.5 0 0 1 3 0v6.5h19V19a1.5 1.5 0 1 1 3 0m-13.561 1.061a1.5 1.5 0 0 0 2.125 0l5-5a1.502 1.502 0 1 0-2.125-2.125L17.5 15.375V5a1.5 1.5 0 1 0-3 0v10.375l-2.439-2.436a1.502 1.502 0 1 0-2.125 2.125z"></path>
                </svg>
              </a>
            </div>
          );
        },
      });
  },
};
