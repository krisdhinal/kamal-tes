import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["container"];

  connect() {
    this.endpoint = this.element.dataset.infiniteScrollEndpoint;
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadMore();
          }
        });
      },
      { rootMargin: "100px" }
    );
    this.observer.observe(this.element);
  }

  async loadMore() {
    this.observer.disconnect(); // Prevent multiple triggers
    const response = await fetch(this.endpoint);
    if (response.ok) {
      const html = await response.text();
      this.containerTarget.insertAdjacentHTML("beforeend", html);
      this.endpoint = this.nextPageUrl();
      if (this.endpoint) {
        this.observer.observe(this.element);
      }
    }
  }

  nextPageUrl() {
    const nextLink = document.querySelector("a[rel='next']");
    return nextLink ? nextLink.href : null;
  }
}
