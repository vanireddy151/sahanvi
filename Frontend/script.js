window.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  const checkoutPrompt = document.querySelector("#checkoutPrompt");
  const cartButton = document.querySelector(".cart-button");
  const closeButton = document.querySelector(".checkout-close");
  const guestForm = document.querySelector(".guest-form");
  const signupModal = document.querySelector("#signupModal");
  const signupOpenButtons = document.querySelectorAll(".signup-open");
  const signupCloseButton = document.querySelector(".signup-close");
  const signupForm = document.querySelector(".signup-form");
  const loginForm = document.querySelector(".login-form");
  const authStatus = document.querySelector(".auth-status");
  const adminProfileLinks = document.querySelectorAll(".admin-profile-link");
  const adminPrivate = document.querySelector(".admin-private");
  const adminDenied = document.querySelector(".admin-denied");
  const adminPhones = ["9704888933", "9949779227"];

  const normalizePhone = (phone) => String(phone || "").replace(/\D/g, "");

  const getSignedInUser = () => {
    const auth = JSON.parse(localStorage.getItem("sahanvi-auth") || "null");
    return auth?.user;
  };

  const isAdminUser = (user) => user?.role === "admin" || adminPhones.includes(normalizePhone(user?.phone));

  const updateProfileMenu = () => {
    const user = getSignedInUser();
    const isAdmin = isAdminUser(user);

    adminProfileLinks.forEach((link) => {
      link.hidden = !isAdmin;
    });

    if (adminPrivate || adminDenied) {
      if (isAdmin) {
        if (adminPrivate) {
          adminPrivate.hidden = false;
        }
        if (adminDenied) {
          adminDenied.hidden = true;
        }
      } else {
        if (adminPrivate) {
          adminPrivate.hidden = true;
        }
        if (adminDenied) {
          adminDenied.hidden = false;
        }
      }
    }
  };

  updateProfileMenu();
  const videoPlayerModal = document.querySelector("#videoPlayerModal");
  const videoPlayerClose = document.querySelector(".video-player-close");
  const mainVideoPlayer = document.querySelector(".main-video-player");
  const dropdownItems = document.querySelectorAll(".nav-item.dropdown");
  const menuButtons = document.querySelectorAll(".menu-button");
  const inquiryForm = document.querySelector("#inquiryForm");
  const inquiryStatus = document.querySelector(".inquiry-status");
  const enquiryList = document.querySelector(".enquiry-list");

  const openCheckoutPrompt = () => {
    if (!checkoutPrompt) {
      return;
    }

    checkoutPrompt.hidden = false;
    document.body.style.overflow = "hidden";
  };

  const closeCheckoutPrompt = () => {
    if (!checkoutPrompt) {
      return;
    }

    checkoutPrompt.hidden = true;
    document.body.style.overflow = "";
  };

  const openSignupModal = () => {
    if (!signupModal) {
      return;
    }

    closeCheckoutPrompt();
    signupModal.hidden = false;
    document.body.style.overflow = "hidden";
  };

  const closeSignupModal = () => {
    if (!signupModal) {
      return;
    }

    signupModal.hidden = true;
    document.body.style.overflow = "";
  };

  const openVideoPlayer = async () => {
    if (!videoPlayerModal || !mainVideoPlayer) {
      return;
    }

    heroVideo?.pause();
    heroVideoCard?.classList.remove("is-playing");
    videoPlayerModal.hidden = false;
    document.body.style.overflow = "hidden";
    mainVideoPlayer.currentTime = 0;
    try {
      await mainVideoPlayer.play();
    } catch {
      mainVideoPlayer.controls = true;
    }
  };

  const closeVideoPlayer = () => {
    if (!videoPlayerModal || !mainVideoPlayer) {
      return;
    }

    mainVideoPlayer.pause();
    videoPlayerModal.hidden = true;
    document.body.style.overflow = "";
  };

  cartButton?.addEventListener("click", openCheckoutPrompt);
  closeButton?.addEventListener("click", closeCheckoutPrompt);
  signupOpenButtons.forEach((button) => {
    button.addEventListener("click", openSignupModal);
  });
  signupCloseButton?.addEventListener("click", closeSignupModal);
  videoPlayerClose?.addEventListener("click", closeVideoPlayer);

  checkoutPrompt?.addEventListener("click", (event) => {
    if (event.target === checkoutPrompt) {
      closeCheckoutPrompt();
    }
  });

  signupModal?.addEventListener("click", (event) => {
    if (event.target === signupModal) {
      closeSignupModal();
    }
  });

  videoPlayerModal?.addEventListener("click", (event) => {
    if (event.target === videoPlayerModal) {
      closeVideoPlayer();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCheckoutPrompt();
      closeSignupModal();
      closeVideoPlayer();
    }
  });

  guestForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    closeCheckoutPrompt();
  });

  signupForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(signupForm);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      if (authStatus) {
        authStatus.textContent = "Passwords do not match.";
      }
      return;
    }

    fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        password
      })
    })
      .then(async (response) => {
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("sahanvi-auth", JSON.stringify(data));
  updateProfileMenu();

  menuButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      document.body.classList.toggle("mobile-menu-open");
    });
  });

  const collectionPages = {
    "Kanjivaram Silks": {
      title: "Kanjivaram Silk Sarees",
      description:
        "At Sahanvi, we treat every Kanjivaram silk saree as a piece of tradition. Our artisans weave each saree in pure silk with rich zari, bringing South Indian heritage to life. Whether you are dressing for a wedding, festival, or family celebration, a Kanjivaram adds a touch of timeless elegance."
    },
    "Banaras Silks": {
      title: "Banaras Silk Sarees",
      description:
        "Discover Banaras silk sarees known for ornate motifs, graceful drape, and heirloom-worthy festive grandeur."
    },
    "Gadwal Pattu": {
      title: "Gadwal Pattu Sarees",
      description:
        "Explore Gadwal Pattu sarees with distinctive borders, refined texture, and traditional artistry."
    },
    "Mysore Silk": {
      title: "Mysore Silk Sarees",
      description:
        "Shop Mysore silk sarees loved for their soft sheen, elegant simplicity, and classic appeal."
    },
    "Paithani Silk": {
      title: "Paithani Silk Sarees",
      description:
        "Find Paithani silk sarees with regal motifs, vibrant pallus, and treasured handloom character."
    },
    "Jamdani Silk": {
      title: "Jamdani Silk Sarees",
      description:
        "Browse Jamdani silk sarees with delicate woven patterns and poetic textile detail."
    },
    "Muga Silk": {
      title: "Muga Silk Sarees",
      description:
        "Explore Muga silk sarees admired for natural golden radiance and rare Assamese heritage."
    },
    Tussar: {
      title: "Tussar Sarees",
      description:
        "Discover Tussar sarees with earthy texture, refined sheen, and effortless everyday sophistication."
    },
    Organza: {
      title: "Organza Sarees",
      description:
        "Shop Organza sarees with airy drapes, graceful translucence, and modern occasion charm."
    },
    Ikkat: {
      title: "Ikkat Sarees",
      description:
        "Explore Ikkat sarees with bold resist-dyed patterns and striking handwoven rhythm."
    },
    "Patola Silk": {
      title: "Patola Silk Sarees",
      description:
        "Browse Patola silk sarees known for geometric richness, colour precision, and artisanal luxury."
    },
    "Patan Patola": {
      title: "Patan Patola Sarees",
      description:
        "Discover Patan Patola sarees crafted with exceptional double-ikat tradition and heirloom value."
    },
    "Chanderi Silk": {
      title: "Chanderi Silk Sarees",
      description:
        "Shop Chanderi silk sarees with feather-light texture, subtle sheen, and elegant motifs."
    },
    "Kota Silk": {
      title: "Kota Silk Sarees",
      description:
        "Explore Kota silk sarees with airy checks, soft drape, and refined festive ease."
    },
    "Linen Silk": {
      title: "Linen Silk Sarees",
      description:
        "Browse Linen Silk sarees that balance breathable comfort with polished elegance."
    },
    "Kora Silk": {
      title: "Kora Silk Sarees",
      description:
        "Discover Kora silk sarees with crisp texture, luminous finish, and understated charm."
    },
    "Semi Kota": {
      title: "Semi Kota Sarees",
      description:
        "Shop Semi Kota sarees with light drape, graceful transparency, and everyday elegance."
    },
    "Soft Silk": {
      title: "Soft Silk Sarees",
      description:
        "Explore Soft Silk sarees with smooth fall, rich colour, and versatile occasion wear."
    },
    "Uppada Silk": {
      title: "Uppada Silk Sarees",
      description:
        "Discover Uppada silk sarees loved for delicate weaving, luxurious feel, and refined finish."
    },
    "Sahanvi Vintage": {
      title: "Sahanvi Vintage",
      description:
        "A curated edit of classic weaves, collector pieces, and sarees with old-world charm."
    }
  };

  const collectionLinks = document.querySelectorAll(".nav-links .dropdown-menu a, .nav-links > a");
  collectionLinks.forEach((link) => {
    const label = link.textContent.trim();
    if (collectionPages[label]) {
      link.href = `collection.html?type=${encodeURIComponent(label)}`;
    }
  });

  const collectionTitle = document.querySelector(".collection-title");
  if (collectionTitle) {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type") || "Kanjivaram Silks";
    const page = collectionPages[type] || {
      title: type,
      description: "Explore handpicked sarees crafted with rich tradition, elegant drapes, and timeless artistry."
    };
    const title = type;
    document.title = `${title} | Sahanvi Handloom Sarees`;
    collectionTitle.textContent = title;
    document.querySelector(".collection-description").textContent = page.description;
    document.querySelectorAll(".collection-product-name").forEach((name, index) => {
      const codes = ["S763878", "S842176", "S529410", "S684302"];
      name.textContent = `${title.replace(/s$/, "")} ${codes[index]}`;
    });
  }

  dropdownItems.forEach((dropdown) => {
    const button = dropdown.querySelector("button");

    button?.addEventListener("click", (event) => {
      event.stopPropagation();
      dropdownItems.forEach((item) => {
        if (item !== dropdown) {
          item.classList.remove("is-open");
        }
      });
      dropdown.classList.toggle("is-open");
    });
  });

  document.addEventListener("click", () => {
    dropdownItems.forEach((dropdown) => dropdown.classList.remove("is-open"));
    document.body.classList.remove("mobile-menu-open");
  });
        if (authStatus) {
          authStatus.textContent = "Registration successful.";
        }
        closeSignupModal();
      })
      .catch((error) => {
        if (authStatus) {
          authStatus.textContent = error.message || "Backend is offline. Please try again later.";
        }
      });
  });

  loginForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);

    fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password")
      })
    })
      .then(async (response) => {
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message);
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("sahanvi-auth", JSON.stringify(data));
        updateProfileMenu();
        if (authStatus) {
          authStatus.textContent = data.user.role === "admin" ? "Admin login successful." : "Login successful.";
        }
        if (data.user.role === "admin") {
          window.location.href = "admin.html";
        }
      })
      .catch((error) => {
        if (authStatus) {
          authStatus.textContent = error.message || "Backend is offline. Please try again later.";
        }
      });
  });

  const heroImages = Array.from(document.querySelectorAll(".hero-slide-image"));
  const heroVideoCard = document.querySelector(".hero-video-card");
  let activeHeroImage = 0;

  if (heroImages.length > 1) {
    setInterval(() => {
      heroImages[activeHeroImage].classList.remove("active");
      activeHeroImage = (activeHeroImage + 1) % heroImages.length;
      heroImages[activeHeroImage].classList.add("active");
    }, 3500);
  }

  const heroVideo = document.querySelector(".hero-video");

  heroVideoCard?.addEventListener("click", async () => {
    if (!heroVideo) {
      return;
    }

    if (heroVideo.paused) {
      try {
        await heroVideo.play();
        heroVideoCard.classList.add("is-playing");
      } catch {
        heroVideo.controls = true;
      }
    } else {
      heroVideo.pause();
      heroVideoCard.classList.remove("is-playing");
    }
  });

  const sareeUploadForm = document.querySelector("#sareeUploadForm");
  const adminStatus = document.querySelector(".admin-status");
  const previewImage = document.querySelector(".admin-preview-image");
  const previewName = document.querySelector(".admin-preview-name");
  const previewPrice = document.querySelector(".admin-preview-price");
  const imageInput = sareeUploadForm?.querySelector('input[name="image"]');
  const categoryInput = sareeUploadForm?.querySelector('select[name="category"]');
  const typeInput = sareeUploadForm?.querySelector('select[name="type"]');

  const sareeTypesByCategory = {
    "Heritage Sarees": [
      "Kanjivaram Silks",
      "Banaras Silks",
      "Gadwal Pattu",
      "Mysore Silk",
      "Paithani Silk",
      "Jamdani Silk",
      "Muga Silk"
    ],
    "Signature Sarees": [
      "Tussar",
      "Organza",
      "Ikkat",
      "Patola Silk",
      "Patan Patola",
      "Chanderi Silk",
      "Kota Silk"
    ],
    Sarees: ["Linen Silk", "Kora Silk", "Semi Kota", "Soft Silk", "Uppada Silk"],
    "Sahanvi Vintage": ["Vintage Silk", "Classic Weaves", "Collector Sarees"]
  };

  const updateSareeTypeOptions = () => {
    if (!categoryInput || !typeInput) {
      return;
    }

    const selectedTypes = sareeTypesByCategory[categoryInput.value] || [];
    typeInput.innerHTML = selectedTypes
      .map((type) => `<option value="${type}">${type}</option>`)
      .join("");
  };

  const formatPrice = (value) => {
    const amount = Number(value || 0);
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const updateAdminPreview = () => {
    if (!sareeUploadForm || !previewName || !previewPrice) {
      return;
    }

    const data = new FormData(sareeUploadForm);
    const name = data.get("name") || "Cream Kanjivaram Silk Saree";
    const code = data.get("code") || "S763878";
    previewName.textContent = `${name} ${code}`;
    previewPrice.textContent = formatPrice(data.get("price") || 21020);
  };

  sareeUploadForm?.addEventListener("input", updateAdminPreview);
  categoryInput?.addEventListener("change", () => {
    updateSareeTypeOptions();
    updateAdminPreview();
  });
  updateSareeTypeOptions();

  imageInput?.addEventListener("change", () => {
    const file = imageInput.files?.[0];
    if (file && previewImage) {
      previewImage.src = URL.createObjectURL(file);
    }
  });

  sareeUploadForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(sareeUploadForm);

    if (adminStatus) {
      adminStatus.textContent = "Uploading saree...";
    }

    try {
      const response = await fetch("http://localhost:5000/api/sarees", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Backend is not ready.");
      }

      if (adminStatus) {
        adminStatus.textContent = "Saree uploaded successfully.";
      }
      sareeUploadForm.reset();
      updateAdminPreview();
    } catch {
      const savedItems = JSON.parse(localStorage.getItem("sahanvi-admin-sarees") || "[]");
      savedItems.unshift({
        category: formData.get("category"),
        type: formData.get("type"),
        name: formData.get("name"),
        code: formData.get("code"),
        price: formData.get("price"),
        description: formData.get("description")
      });
      localStorage.setItem("sahanvi-admin-sarees", JSON.stringify(savedItems));

      if (adminStatus) {
        adminStatus.textContent = "Backend is offline, so this saree was saved locally in this browser.";
      }
    }
  });

  const getLocalEnquiries = () => JSON.parse(localStorage.getItem("sahanvi-inquiries") || "[]");

  const saveLocalEnquiry = (inquiry) => {
    const enquiries = getLocalEnquiries();
    enquiries.unshift({
      ...inquiry,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem("sahanvi-inquiries", JSON.stringify(enquiries));
  };

  inquiryForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(inquiryForm);
    const inquiry = Object.fromEntries(formData.entries());

    if (inquiryStatus) {
      inquiryStatus.textContent = "Submitting inquiry...";
    }

    try {
      const response = await fetch("http://localhost:5000/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiry)
      });

      if (!response.ok) {
        throw new Error("Backend offline");
      }

      if (inquiryStatus) {
        inquiryStatus.textContent = "Inquiry submitted successfully.";
      }
    } catch {
      saveLocalEnquiry(inquiry);
      if (inquiryStatus) {
        inquiryStatus.textContent = "Inquiry saved locally. Admin can view it in this browser.";
      }
    }

    inquiryForm.reset();
  });

  const renderEnquiries = (enquiries) => {
    if (!enquiryList) {
      return;
    }

    if (!enquiries.length) {
      enquiryList.innerHTML = '<p class="admin-status">No enquiries yet.</p>';
      return;
    }

    enquiryList.innerHTML = enquiries
      .map(
        (item) => `
          <article class="enquiry-card">
            <h3>${item.subject || "Inquiry"}</h3>
            <p><strong>Name:</strong> ${item.name || ""}</p>
            <p><strong>Email:</strong> ${item.email || ""}</p>
            <p><strong>Phone:</strong> ${item.phone || ""}</p>
            <p><strong>Message:</strong> ${item.message || ""}</p>
            <p><strong>Received:</strong> ${item.createdAt ? new Date(item.createdAt).toLocaleString() : "Just now"}</p>
          </article>
        `
      )
      .join("");
  };

  const loadEnquiries = async () => {
    if (!enquiryList) {
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/inquiries");
      if (!response.ok) {
        throw new Error("Backend offline");
      }
      renderEnquiries(await response.json());
    } catch {
      renderEnquiries(getLocalEnquiries());
    }
  };

  loadEnquiries();
});
