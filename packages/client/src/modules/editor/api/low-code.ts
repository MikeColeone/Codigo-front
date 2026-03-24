import type {
  PostReleaseRequest,
  getQuestionDataByIdRequest,
} from "@codigo/materials-react";
import request from "@/shared/utils/request";

export async function postRelease(data: PostReleaseRequest) {
  return request("/pages/me", {
    data,
    method: "PUT",
  });
}

export async function getLowCodePage() {
  return request("/pages/me", { method: "GET" });
}

export async function getQuestionComponents() {
  return request("/pages/me/analytics/components", { method: "GET" });
}

export async function getQuestionData() {
  return request("/pages/me/analytics/submissions", { method: "GET" });
}

export async function getQuestionDataByTypeRequest(
  data: getQuestionDataByIdRequest,
) {
  return request(`/pages/me/analytics/components/${data.id}/submissions`, {
    method: "GET",
  });
}

export async function getPageVersions(id: number) {
  return request(`/pages/${id}/versions`, { method: "GET" });
}

export async function getPageVersionDetail(id: number, versionId: string) {
  return request(`/pages/${id}/versions/${versionId}`, { method: "GET" });
}
