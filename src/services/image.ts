import type { AxiosProgressEvent } from "axios";
import { type MediaResponse } from "~/@types";
import { http } from "~/libs/axios";

interface Params {
  file: File;
  progressCallback?: (ProgressEvent: AxiosProgressEvent) => void;
}

type MediaProvider = {
  upload: (params: Params) => Promise<MediaResponse>;
};

export const mediaService: MediaProvider = {
  upload: async (value) => {
    const fd = new FormData();

    fd.append("file", value.file);

    const res = await http<MediaResponse>("POST", {
      url: "/media",
      data: fd,
      onUploadProgress: value.progressCallback,
    });

    return res;
  },
};
