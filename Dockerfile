FROM python:3.9.2-slim-buster

ARG USERNAME=robot
ARG USER_GID=1000

ENV ROBOT_WORK_DIR=/app \
    ROBOT_REPORTS_DIR=/app/reports \
    PYTHONPATH="$PYTHONPATH:$ROBOT_WORK_DIR" \
    PYTHONWARNINGS="ignore:Unverified HTTPS request"

RUN apt update \
    && apt install -y --no-install-recommends zsh curl git openssh-server sudo \
    && rm -rf /var/lib/apt/lists/* \
    && apt autoclean \
    && groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_GID --gid $USERNAME --shell /bin/zsh --create-home $USERNAME \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME \
    && mkdir -p \
    ${ROBOT_WORK_DIR} \
    ${ROBOT_REPORTS_DIR} \
    /home/$USERNAME/.vscode-server/extensions \
    /home/$USERNAME/.vscode-server-insiders/extensions \
    && chown -R $USERNAME \
    ${ROBOT_WORK_DIR} \
    ${ROBOT_REPORTS_DIR} \
    /home/$USERNAME/.vscode-server \
    /home/$USERNAME/.vscode-server-insiders

USER $USERNAME

WORKDIR ${ROBOT_WORK_DIR}
VOLUME ${ROBOT_REPORTS_DIR}

RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" \
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/polyms/devcontainers/main/.zshrc -o /home/robot/.zshrc)" \
    && git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting \
    && git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions \
    && export ROBOT_OPTIONS="--outputdir ${ROBOT_REPORTS_DIR}" \
    && echo 'export PATH=$PATH:/home/$USERNAME/.local/bin' >> ~/.zshrc

RUN pip install --upgrade \
    pipenv \
    robotframework \
    robotframework-seleniumlibrary \
    robotframework-requests \
    pyyaml

COPY --chown=$USERNAME:$USERNAME ./public/index.html ./public/robot.min.js ./public/styles.css ${ROBOT_REPORTS_DIR}/

CMD ["python", "-m", "robot", "tests"]
